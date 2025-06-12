import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import logging

def crawl_faculty_info(department):
    """
    Crawl faculty information for a given department
    Args:
        department (str): Department name (e.g., 'bioengineering', 'computer-science')
    """
    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Base URL pattern
    base_url = f"https://{department}.stanford.edu"
    faculty_url = f"{base_url}/people/faculty" #{base_url}/people/faculty
    
    logging.info(f"Starting to crawl faculty information from {faculty_url}")
    
    # Send GET request to the URL
    try:
        response = requests.get(faculty_url, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
    except requests.RequestException as e:
        logging.error(f"Failed to fetch the webpage: {str(e)}")
        return
    
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all faculty members
    faculty_list = []
    
    # Find all faculty entries - looking for h3 elements that contain faculty names
    faculty_entries = soup.find_all('h3')
    
    for entry in faculty_entries:
        # Get the parent element that contains both name and link
        parent = entry.parent
        
        # Get faculty name
        name = entry.text.strip()
        
        # Get faculty URL
        link_element = parent.find('a')
        if link_element and 'href' in link_element.attrs:
            url = link_element['href']
            # Make sure the URL is absolute
            if not url.startswith('http'):
                url = f"{base_url}{url}"
            
            faculty_list.append({
                'name': name,
                'url': url
            })
    
    if not faculty_list:
        logging.warning("No faculty members found!")
        return
    
    # Create DataFrame and save to CSV
    df = pd.DataFrame(faculty_list)
    output_file = f'faculty_url_{department}.csv'
    df.to_csv(output_file, index=False, encoding='utf-8')
    logging.info(f"Successfully saved {len(faculty_list)} faculty members to {output_file}")
    
    # Print the first few entries for verification
    logging.info("\nFirst few entries:")
    logging.info(df.head().to_string())
    
    return df

if __name__ == "__main__":
    # Example usage
    department = "me"  # Change this to the desired department
    crawl_faculty_info(department)
