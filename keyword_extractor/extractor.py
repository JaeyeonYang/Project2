import PyPDF2
import google.generativeai as genai
import os
import json
import re
from typing import Dict, List
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

class KeywordExtractor:
    def __init__(self):
        # Gemini API 키 설정
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not self.gemini_api_key:
            raise Exception("GEMINI_API_KEY가 설정되지 않았습니다.")
        
        genai.configure(api_key=self.gemini_api_key)
        self.gemini_model = genai.GenerativeModel('gemini-2.0-flash')
    
    def is_configured(self) -> bool:
        """Gemini API 키가 설정되어 있는지 확인"""
        return bool(self.gemini_api_key)
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """PDF에서 텍스트 추출"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text() + "\n"
                
                return text.strip()
        
        except Exception as e:
            raise Exception(f"PDF 텍스트 추출 실패: {str(e)}")
    
    def clean_text(self, text: str) -> str:
        """텍스트 전처리"""
        # 불필요한 문자 제거
        text = re.sub(r'[^\w\s\.\-\+\#]', ' ', text)
        # 연속된 공백 제거
        text = re.sub(r'\s+', ' ', text)
        # 앞뒤 공백 제거
        text = text.strip()
        return text
    
    async def extract_with_gemini(self, text: str) -> Dict:
        """Gemini API를 사용한 키워드 추출"""
        try:
            prompt = f"""
다음은 연구자의 CV 텍스트입니다. 이 CV에서 연구 관련 키워드를 추출해서 분류해주세요.
한국어와 영어가 혼용되어 있을 수 있습니다.

CV 텍스트:
{text[:6000]}  # Gemini는 더 많은 토큰 처리 가능

다음 JSON 형태로 정확히 응답해주세요:
{{
    "research_fields": ["AI", "Machine Learning", "Computer Vision"],
    "technologies": ["Python", "TensorFlow", "PyTorch"],
    "methods": ["Deep Learning", "CNN", "Transfer Learning"], 
    "applications": ["Medical Imaging", "Natural Language Processing"],
    "confidence": "high"
}}

주의사항:
- 각 카테고리당 최대 8개까지만 포함
- 너무 일반적인 단어는 제외 (예: "computer", "software")
- 신뢰도는 high/medium/low 중 하나
- 정확한 JSON 형태로만 응답
"""

            # Gemini API 호출
            response = self.gemini_model.generate_content(prompt)
            content = response.text.strip()
            
            # JSON 파싱 시도
            try:
                # ```json으로 감싸진 경우 처리
                if '```json' in content:
                    content = content.split('```json')[1].split('```')[0].strip()
                elif '```' in content:
                    content = content.split('```')[1].strip()
                
                result = json.loads(content)
                return {
                    "method": "gemini",
                    "keywords": self._flatten_keywords(result),
                    "categories": result,
                    "confidence": result.get("confidence", "medium")
                }
            except json.JSONDecodeError as e:
                print(f"JSON 파싱 오류: {str(e)}")
                raise Exception("Gemini API 응답을 JSON으로 파싱할 수 없습니다.")
        
        except Exception as e:
            print(f"Gemini 키워드 추출 중 오류 발생: {str(e)}")
            raise Exception(f"Gemini 키워드 추출 실패: {str(e)}")
    
    def _flatten_keywords(self, categories: Dict) -> List[str]:
        """카테고리별 키워드를 하나의 리스트로 합치기"""
        all_keywords = []
        for category_keywords in categories.values():
            if isinstance(category_keywords, list):
                all_keywords.extend(category_keywords)
        
        # 중복 제거 및 정렬
        return list(set(all_keywords))[:20]  # 최대 20개
    
    async def extract_keywords(self, pdf_path: str) -> Dict:
        """메인 키워드 추출 함수"""
        print(f"📄 PDF 파일 처리 시작: {pdf_path}")
        
        # 1. PDF에서 텍스트 추출
        text = self.extract_text_from_pdf(pdf_path)
        cleaned_text = self.clean_text(text)
        
        if len(cleaned_text) < 100:
            raise Exception("추출된 텍스트가 너무 짧습니다. PDF 파일을 확인해주세요.")
        
        print(f"📝 텍스트 추출 완료: {len(cleaned_text)} 글자")
        
        # 2. Gemini API로 키워드 추출
        print("🤖 Gemini API로 키워드 추출 시도...")
        result = await self.extract_with_gemini(cleaned_text)
        print(f"✅ Gemini 추출 성공: {len(result['keywords'])}개 키워드")
        
        return result 