import pandas as pd
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging
import google.generativeai as genai
import time
from typing import Set, Dict, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('lab_crawling.log'),
        logging.StreamHandler()
    ]
)

# Gemini API configuration
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

class LabCrawler:
    def __init__(self):
        self.visited_urls: Set[str] = set()
        self.lab_info: Dict[str, Dict] = {}
        self.model = genai.GenerativeModel('gemini-pro')
        
    def is_valid_url(self, url: str, base_domain: str) -> bool:
        """Check if URL belongs to the same domain and is valid."""
        try:
            parsed_url = urlparse(url)
            parsed_base = urlparse(base_domain)
            return parsed_url.netloc == parsed_base.netloc and url.startswith(('http://', 'https://'))
        except:
            return False

    def extract_text_content(self, soup: BeautifulSoup) -> str:
        """Extract relevant text content from the page."""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text(separator=' ', strip=True)
        return ' '.join(text.split())

    def crawl_page(self, url: str, base_domain: str, depth: int = 0, max_depth: int = 2) -> None:
        """Crawl a single page and its subpages."""
        if depth > max_depth or url in self.visited_urls:
            return

        self.visited_urls.add(url)
        logging.info(f"Crawling: {url} (depth: {depth})")

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract PI and lab name (this is a basic implementation)
            # You might need to adjust the selectors based on the actual website structure
            pi_name = None
            lab_name = None
            
            # Try to find PI name (common patterns)
            pi_candidates = soup.find_all(['h1', 'h2', 'h3'], string=lambda x: x and ('Professor' in x or 'PI' in x or 'Principal Investigator' in x))
            if pi_candidates:
                pi_name = pi_candidates[0].get_text().strip()
            
            # Try to find lab name
            lab_candidates = soup.find_all(['h1', 'h2'], string=lambda x: x and ('Lab' in x or 'Laboratory' in x))
            if lab_candidates:
                lab_name = lab_candidates[0].get_text().strip()

            # Store information
            if pi_name or lab_name:
                self.lab_info[url] = {
                    'pi_name': pi_name,
                    'lab_name': lab_name,
                    'content': self.extract_text_content(soup)
                }

            # Find and crawl subpages
            if depth < max_depth:
                for link in soup.find_all('a', href=True):
                    next_url = urljoin(url, link['href'])
                    if self.is_valid_url(next_url, base_domain):
                        time.sleep(1)  # Be nice to the server
                        self.crawl_page(next_url, base_domain, depth + 1, max_depth)

        except Exception as e:
            logging.error(f"Error crawling {url}: {str(e)}")

    def generate_keywords_and_description(self, content: str) -> tuple:
        """Generate keywords and description using Gemini API."""
        try:
            # Generate keywords
            keywords_prompt = f"Extract 20 most important keywords from the following text. Return only the keywords separated by commas:\n\n{content[:4000]}"
            keywords_response = self.model.generate_content(keywords_prompt)
            keywords = keywords_response.text.strip()

            # Generate description
            description_prompt = f"Write a 500-word description of the research lab based on the following text. Focus on research areas, achievements, and current projects:\n\n{content[:4000]}"
            description_response = self.model.generate_content(description_prompt)
            description = description_response.text.strip()

            return keywords, description
        except Exception as e:
            logging.error(f"Error generating content with Gemini: {str(e)}")
            return None, None

def main():
    # Read CSV file
    df = pd.read_csv('faculty_lab_urls.csv')
    
    # Initialize crawler
    crawler = LabCrawler()
    
    # Process each lab URL
    for _, row in df.iterrows():
        lab_url = row['lab_url'].strip()
        if lab_url and lab_url != "https://aa.stanford.edu/our-culture/diversity-equity-inclusion-belonging":
            logging.info(f"\nProcessing lab URL: {lab_url}")
            base_domain = urlparse(lab_url).netloc
            crawler.crawl_page(lab_url, f"https://{base_domain}")
            
            # Generate keywords and description for each lab
            for url, info in crawler.lab_info.items():
                if info['content']:
                    keywords, description = crawler.generate_keywords_and_description(info['content'])
                    if keywords and description:
                        info['keywords'] = keywords
                        info['description'] = description
                        
                        # Save results
                        with open('lab_analysis_results.txt', 'a', encoding='utf-8') as f:
                            f.write(f"\n{'='*80}\n")
                            f.write(f"Lab URL: {url}\n")
                            f.write(f"PI Name: {info['pi_name']}\n")
                            f.write(f"Lab Name: {info['lab_name']}\n")
                            f.write(f"Keywords: {keywords}\n")
                            f.write(f"Description: {description}\n")
                            f.write(f"{'='*80}\n")

if __name__ == "__main__":
    main()
