import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import logging

def crawl_faculty_info(department, faculty_urls):
    """
    Crawl faculty information from given URLs
    Args:
        department (str): Department name (e.g., 'ast')
        faculty_urls (list): List of faculty profile URLs
    """
    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Add headers to mimic a browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    faculty_list = []
    
    for url in faculty_urls:
        try:
            logging.info(f"Fetching profile from {url}")
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Get name from h1 tag
            name = soup.find('h1').text.strip()
            
            # Find research website
            research_website = None
            for text in soup.stripped_strings:
                if 'Research Website:' in text:
                    research_website = text.split('Research Website:')[1].strip()
                    break
            
            faculty_list.append({
                'name': name,
                'url': url,
                'profile': research_website if research_website else ''
            })
            
            # Add a small delay to avoid overwhelming the server
            time.sleep(1)
            
        except requests.RequestException as e:
            logging.error(f"Failed to fetch profile from {url}: {str(e)}")
            continue
    
    if not faculty_list:
        logging.warning("No faculty members found!")
        return
    
    # Create DataFrame and save to CSV
    df = pd.DataFrame(faculty_list)
    output_file = f'PI_url/PI_profile_{department}.csv'
    df.to_csv(output_file, index=False, encoding='utf-8')
    logging.info(f"Successfully saved {len(faculty_list)} faculty members to {output_file}")
    
    # Print the first few entries for verification
    logging.info("\nFirst few entries:")
    logging.info(df.head().to_string())
    
    return df

def crawl_ast_faculty():
    """Crawl faculty information from AST department website"""
    url = "https://ast.berkeley.edu/faculty/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        faculty_list = []
        current_name = None
        current_website = None
        
        # Find all text content
        for element in soup.stripped_strings:
            # If it's a name (no email or website in the line)
            if '@' not in element and 'http' not in element and len(element.split()) >= 2:
                if current_name and current_website:
                    faculty_list.append({
                        'name': current_name,
                        'url': current_website,
                        'profile': ''
                    })
                current_name = element
                current_website = None
            # If it's a website
            elif 'http' in element:
                current_website = element
        
        # Add the last faculty member
        if current_name and current_website:
            faculty_list.append({
                'name': current_name,
                'url': current_website,
                'profile': ''
            })
        
        # Create DataFrame and save to CSV
        df = pd.DataFrame(faculty_list)
        output_file = 'PI_url/PI_profile_ast.csv'
        df.to_csv(output_file, index=False, encoding='utf-8')
        logging.info(f"Successfully saved {len(faculty_list)} faculty members to {output_file}")
        
        return df
        
    except requests.RequestException as e:
        logging.error(f"Failed to fetch AST faculty page: {str(e)}")
        return None

if __name__ == "__main__":
    # Crawl AST faculty information
    crawl_ast_faculty()
