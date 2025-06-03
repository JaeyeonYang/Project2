import pandas as pd
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import time
import os
from urllib.parse import urljoin

# Gemini API 설정
GOOGLE_API_KEY = "AIzaSyAwPxhuFhQOfT7qHftOJmlpd4SbiPtUARY"  # 여기에 API 키를 입력하세요
genai.configure(api_key=GOOGLE_API_KEY)

def get_page_content(url):
    """웹페이지의 내용을 가져오는 함수"""
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            # 메인 콘텐츠 추출
            content = ' '.join([p.text for p in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])])
            return content
        return None
    except Exception as e:
        print(f"Error fetching {url}: {str(e)}")
        return None

def analyze_with_gemini(content):
    """Gemini API를 사용하여 내용을 분석하는 함수"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""You are an AI research lab analyst. Your task is to analyze the following research lab website content and provide a structured analysis in English only.

Content to analyze:
{content}

Required output format (MUST be in English):
1. First, list exactly 20 research keywords that best represent the lab's research areas. Format as a comma-separated list.
2. Then, provide a comprehensive 500-word introduction of the research lab, focusing on their main research areas, methodologies, and contributions to the field.

Output format (copy and fill in the brackets):
Keywords: [keyword1, keyword2, keyword3, ..., keyword20]
Introduction: [Write a detailed 500-word introduction in English]

Important:
- Keywords should be technical and specific to the research field
- Introduction should be professional and academic in tone
- Answer MUST be in English only
- Do not include any Korean text in the response
- If the input content is in Korean, translate and analyze it in English"""
        
        response = model.generate_content(prompt)
        response_text = response.text
        
        # 응답이 한국어로 되어있는지 확인
        if any('\uAC00' <= char <= '\uD7A3' for char in response_text):
            print("Warning: Response contains Korean characters. Retrying with stronger English enforcement...")
            # 한국어가 포함된 경우 재시도
            prompt += "\nIMPORTANT: Your previous response contained Korean characters. Please provide the analysis in English ONLY."
            response = model.generate_content(prompt)
            response_text = response.text
        
        return response_text
    except Exception as e:
        print(f"Error with Gemini API: {str(e)}")
        return None

def main():
    # CSV 파일 읽기
    df = pd.read_csv('PI_profile.csv')
    
    # 결과를 저장할 리스트
    results = []
    
    # 각 교수진의 웹사이트 분석
    for index, row in df.iterrows():
        name = row['name']
        urls = row['additional_urls']
        
        # diversity-equity-inclusion-belonging 링크 제외
        if isinstance(urls, str):
            urls = [url.strip() for url in urls.split(',')]
            urls = [url for url in urls if 'diversity-equity-inclusion-belonging' not in url]
        else:
            urls = []
        
        print(f"\nProcessing {name}'s websites...")
        
        all_content = []
        for url in urls:
            content = get_page_content(url)
            if content:
                all_content.append(content)
            time.sleep(1)  # 서버 부하 방지
        
        if all_content:
            combined_content = ' '.join(all_content)
            analysis = analyze_with_gemini(combined_content)
            
            if analysis:
                results.append({
                    'name': name,
                    'analysis': analysis
                })
                
                # 결과를 파일에 저장
                with open('lab_analysis_results.txt', 'a', encoding='utf-8') as f:
                    f.write(f"\n{'='*50}\n")
                    f.write(f"Professor: {name}\n")
                    f.write(f"Analysis:\n{analysis}\n")
        
        time.sleep(2)  # API 호출 간격 조절
    
    print("\nAnalysis completed. Results saved to lab_analysis_results.txt")

if __name__ == "__main__":
    main() 