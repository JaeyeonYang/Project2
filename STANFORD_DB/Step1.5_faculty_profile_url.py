import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
import re
import logging

def scrape_faculty_profiles(department):
    """
    Scrape faculty profiles for a given department
    Args:
        department (str): Department name (e.g., 'bioengineering', 'computer-science')
    """
    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Base URL pattern
    base_url = f"https://www.{department}.stanford.edu" #https://{department}.stanford.edu
    
    # Read the faculty URLs
    try:
        df = pd.read_csv(f'faculty_url_{department}.csv')
        logging.info(f"Successfully read {len(df)} faculty URLs")
    except Exception as e:
        logging.error(f"Error reading CSV file: {str(e)}")
        raise

    # Update URLs to use the correct department domain
    df['url'] = df['url'].str.replace('aa.stanford.edu', f'{department}.stanford.edu')

    # Create lists to store the profiles
    profiles = []
    failed_profiles = []

    # Function to extract URLs from text and links
    def extract_urls(soup, text):
        urls = []
        
        # Find the "Links" text and get the next link
        links_text = soup.find(string=lambda text: text and "Links" in text)
        if links_text:
            # Find the next link after "Links"
            next_link = links_text.find_next('a')
            if next_link and next_link.get('href'):
                href = next_link['href']
                # Convert relative URLs to absolute URLs
                if href.startswith('/'):
                    href = f'{base_url}{href}'
                if href.startswith('http'):
                    urls.append(href)
        
        # Also look for URLs in text after "Links"
        if "Links" in text:
            after_links = text.split("Links")[1]
            text_urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', after_links)
            urls.extend(text_urls)
        
        # Remove duplicates and join
        return ' '.join(list(set(urls)))

    # Function to scrape profile
    def scrape_profile(url):
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Get all text content from the main content area
                main_content = soup.find('main')
                if main_content:
                    # Get all text content
                    profile_text = main_content.get_text(separator=' ', strip=True)
                    # Extract URLs
                    urls = extract_urls(soup, profile_text)
                    return profile_text, urls
                return "No profile content found", ""
            else:
                return f"Failed to access URL: {response.status_code}", ""
        except requests.Timeout:
            return "Error: Request timed out", ""
        except requests.RequestException as e:
            return f"Error: {str(e)}", ""
        except Exception as e:
            return f"Error: {str(e)}", ""

    # Scrape each profile
    for index, row in df.iterrows():
        logging.info(f"Scraping profile for {row['name']}...")
        profile, urls = scrape_profile(row['url'])
        
        profile_data = {
            'name': row['name'],
            'url': row['url'],
            'profile': profile,
            'additional_urls': urls
        }
        
        # If no URLs found, add to failed_profiles
        if not urls:
            failed_profiles.append(profile_data)
            logging.warning(f"No URLs found for {row['name']}")
        else:
            profiles.append(profile_data)
            logging.info(f"Successfully scraped profile for {row['name']}")
        
        # Add a small delay to be respectful to the server
        time.sleep(1)

    # Create DataFrames
    profiles_df = pd.DataFrame(profiles)
    failed_profiles_df = pd.DataFrame(failed_profiles)

    # Save to CSV files
    try:
        profiles_df.to_csv(f'PI_profile_{department}.csv', index=False)
        failed_profiles_df.to_csv(f'failed_lab_url_{department}.csv', index=False)
        logging.info(f"Successfully saved {len(profiles)} profiles to PI_profile_{department}.csv")
        logging.info(f"Successfully saved {len(failed_profiles)} failed profiles to failed_lab_url_{department}.csv")
    except Exception as e:
        logging.error(f"Error saving CSV files: {str(e)}")
        raise

if __name__ == "__main__":
    # Example usage
    department = "me"  # Change this to the desired department
    scrape_faculty_profiles(department)
