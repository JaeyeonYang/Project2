import pandas as pd
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import time
import os
from urllib.parse import urljoin
import logging

# Gemini API 설정
GOOGLE_API_KEY = "AIzaSyBwmd3yfpzH-pHQESN_avzav0QcaKqch1Y"  # 여기에 API 키를 입력하세요
genai.configure(api_key=GOOGLE_API_KEY)

def get_page_content(url):
    """웹페이지의 내용을 가져오는 함수"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        # 메인 콘텐츠 추출
        content = ' '.join([p.text for p in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])])
        return content
    except Exception as e:
        logging.error(f"Error fetching {url}: {str(e)}")
        return None

def analyze_with_gemini(content):
    """Gemini API를 사용하여 내용을 분석하는 함수"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        You are an AI research lab analyst. Your task is to analyze the following research lab website content and provide a structured analysis in English only.
        
        Content to analyze:
        {content}
        Required output format (MUST be in English):
        1. First, list  20 research keywords that best represent the lab's research areas. Format as a comma-separated list.
        2. Then, provide a comprehensive 500-word introduction of the research lab, focusing on their main research areas, methodologies, and contributions to the field.

        Output format (copy and fill in the brackets):
        Keywords: [keyword1, keyword2, keyword3, ..., keyword20]
        Introduction: [Write a detailed 500-word introduction in English]

        Important:
        - Keywords should be technical and specific to the research field
        - Introduction should be professional and academic in tone
        - Answer should be in English only
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logging.error(f"Error with Gemini API: {str(e)}")
        return None

def analyze_labs(department):
    """
    Analyze research labs for a given department
    Args:
        department (str): Department name (e.g., 'bioengineering', 'computer-science')
    """
    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # CSV 파일 읽기
    input_file = f'/Users/jaeyeonyang/Dropbox/학교/강의/EF/AI programming/Project2/CALTECH_DB/faculty_url_Chemistry_and_Chemical_engineering.csv'
    output_file = f'{department.capitalize()}.txt'
    
    try:
        df = pd.read_csv(input_file)
        logging.info(f"Successfully read {len(df)} faculty profiles from {input_file}")
    except Exception as e:
        logging.error(f"Error reading CSV file: {str(e)}")
        return
    
    # 결과를 저장할 리스트
    results = []
    
    # 각 교수진의 웹사이트 분석
    for index, row in df.iterrows():
        name = row['name']
        url = row['url']  # 단일 URL 사용
        
        logging.info(f"\nProcessing {name}'s website...")
        
        content = get_page_content(url)
        if content:
            analysis = analyze_with_gemini(content)
            
            if analysis:
                results.append({
                    'name': name,
                    'analysis': analysis
                })
                
                # 결과를 파일에 저장
                with open(output_file, 'a', encoding='utf-8') as f:
                    f.write(f"\n{'='*50}\n")
                    f.write(f"Professor: {name}\n")
                    f.write(f"Analysis:\n{analysis}\n")
                
                logging.info(f"Successfully analyzed {name}'s lab")
        
        time.sleep(2)  # API 호출 간격 조절
    
    logging.info(f"\nAnalysis completed. Results saved to {output_file}")
    return results

if __name__ == "__main__":
    # Example usage
    department = "me"  # Change this to the desired department
    analyze_labs(department) 