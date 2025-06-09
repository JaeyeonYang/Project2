import PyPDF2
import google.generativeai as genai  # Gemini API 추가
import os
import json
import re
from typing import Dict, List, Optional
from dotenv import load_dotenv
import asyncio
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from collections import Counter

# 환경변수 로드
load_dotenv()

class KeywordExtractor:
    def __init__(self):
        # Gemini API 키 설정 (우선순위)
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.gemini_model = genai.GenerativeModel('gemini-pro')
        
        # OpenAI API 키 설정 (폴백용)
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        
        # 연구 분야 키워드 사전 (폴백용)
        self.research_keywords = {
            "ai_ml": ["artificial intelligence", "machine learning", "deep learning", "neural network", 
                     "AI", "ML", "DL", "CNN", "RNN", "LSTM", "GAN", "transformer", "bert", "gpt"],
            "computer_vision": ["computer vision", "image processing", "opencv", "CNN", "object detection",
                               "segmentation", "classification", "recognition", "medical imaging"],
            "nlp": ["natural language processing", "NLP", "text mining", "sentiment analysis", 
                   "language model", "tokenization", "embedding", "BERT", "GPT"],
            "robotics": ["robotics", "autonomous", "control system", "sensor", "navigation", 
                        "manipulation", "ROS", "motion planning"],
            "data_science": ["data science", "data analysis", "statistics", "visualization", 
                            "pandas", "numpy", "matplotlib", "seaborn", "jupyter"],
            "programming": ["python", "java", "c++", "javascript", "tensorflow", "pytorch", 
                           "scikit-learn", "keras", "react", "node.js", "git", "docker"],
            "research_methods": ["research", "experiment", "analysis", "methodology", "publication",
                                "conference", "journal", "paper", "thesis", "dissertation"] 
        }
    
    def is_gemini_configured(self) -> bool:
        """Gemini API 키가 설정되어 있는지 확인"""
        return bool(self.gemini_api_key)
    
    def is_openai_configured(self) -> bool:
        """OpenAI API 키가 설정되어 있는지 확인"""
        return bool(self.openai_api_key)
    
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

            if not self.gemini_api_key:
                raise Exception("Gemini API 키가 설정되지 않았습니다.")

            try:
                # Gemini API 호출
                response = self.gemini_model.generate_content(prompt)
                content = response.text.strip()
                
            except Exception as e:
                print(f"Gemini API 오류: {str(e)}")
                raise Exception(f"Gemini API 호출 실패: {str(e)}")
            
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
                # JSON 파싱 실패시 텍스트에서 키워드 추출 시도
                keywords = self._extract_keywords_from_text(content)
                return {
                    "method": "gemini_text",
                    "keywords": keywords,
                    "categories": {"extracted": keywords},
                    "confidence": "low"
                }
        
        except Exception as e:
            print(f"Gemini 키워드 추출 중 오류 발생: {str(e)}")
            raise Exception(f"Gemini 키워드 추출 실패: {str(e)}")
    
    async def extract_with_openai(self, text: str) -> Dict:
        """OpenAI API를 사용한 키워드 추출 (폴백용)"""
        try:
            import openai  # 필요시에만 import
            
            prompt = f"""
다음은 연구자의 CV 텍스트입니다. 이 CV에서 연구 관련 키워드를 추출해서 분류해주세요.
한국어와 영어가 혼용되어 있을 수 있습니다.

CV 텍스트:
{text[:4000]}  # 토큰 제한을 위해 4000자로 제한

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

            if not self.openai_api_key:
                raise Exception("OpenAI API 키가 설정되지 않았습니다.")

            openai.api_key = self.openai_api_key
            
            try:
                response = await openai.ChatCompletion.acreate(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "당신은 연구자의 CV에서 정확한 키워드를 추출하는 전문가입니다."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=800
                )
            except Exception as e:
                print(f"OpenAI API 오류: {str(e)}")
                raise Exception(f"OpenAI API 호출 실패: {str(e)}")
            
            content = response.choices[0].message.content.strip()
            
            # JSON 파싱 시도
            try:
                result = json.loads(content)
                return {
                    "method": "openai",
                    "keywords": self._flatten_keywords(result),
                    "categories": result,
                    "confidence": result.get("confidence", "medium")
                }
            except json.JSONDecodeError as e:
                print(f"JSON 파싱 오류: {str(e)}")
                keywords = self._extract_keywords_from_text(content)
                return {
                    "method": "openai_text",
                    "keywords": keywords,
                    "categories": {"extracted": keywords},
                    "confidence": "low"
                }
        
        except Exception as e:
            print(f"OpenAI 키워드 추출 중 오류 발생: {str(e)}")
            raise Exception(f"OpenAI 키워드 추출 실패: {str(e)}")
    
    def extract_with_fallback(self, text: str) -> Dict:
        """폴백 방식: 수동 키워드 추출"""
        print("📋 폴백 모드: 수동 키워드 추출 실행")
        
        text_lower = text.lower()
        found_keywords = {
            "research_fields": [],
            "technologies": [],
            "methods": [],
            "applications": []
        }
        
        # 사전 기반 키워드 매칭
        for category, keywords in self.research_keywords.items():
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    if category in ["ai_ml", "computer_vision", "nlp", "robotics"]:
                        found_keywords["research_fields"].append(keyword)
                    elif category == "programming":
                        found_keywords["technologies"].append(keyword)
                    elif category == "research_methods":
                        found_keywords["methods"].append(keyword)
                    else:
                        found_keywords["applications"].append(keyword)
        
        # 중복 제거 및 정렬
        for category in found_keywords:
            found_keywords[category] = list(set(found_keywords[category]))[:8]
        
        # TF-IDF로 중요 키워드 추가
        try:
            additional_keywords = self._extract_with_tfidf(text)
            found_keywords["applications"].extend(additional_keywords[:5])
            found_keywords["applications"] = list(set(found_keywords["applications"]))[:8]
        except:
            pass
        
        all_keywords = self._flatten_keywords(found_keywords)
        
        return {
            "method": "fallback",
            "keywords": all_keywords,
            "categories": found_keywords,
            "confidence": "medium" if len(all_keywords) > 5 else "low"
        }
    
    def _extract_with_tfidf(self, text: str) -> List[str]:
        """TF-IDF를 사용한 중요 키워드 추출"""
        try:
            # 단어 추출
            words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
            text_for_tfidf = ' '.join(words)
            
            vectorizer = TfidfVectorizer(
                max_features=100,
                stop_words='english',
                ngram_range=(1, 2)
            )
            
            tfidf_matrix = vectorizer.fit_transform([text_for_tfidf])
            feature_names = vectorizer.get_feature_names_out()
            tfidf_scores = tfidf_matrix.toarray()[0]
            
            # 상위 키워드 추출
            keyword_scores = list(zip(feature_names, tfidf_scores))
            keyword_scores.sort(key=lambda x: x[1], reverse=True)
            
            return [kw[0] for kw in keyword_scores[:10] if kw[1] > 0.1]
        
        except:
            return []
    
    def _flatten_keywords(self, categories: Dict) -> List[str]:
        """카테고리별 키워드를 하나의 리스트로 합치기"""
        all_keywords = []
        for category_keywords in categories.values():
            if isinstance(category_keywords, list):
                all_keywords.extend(category_keywords)
        
        # 중복 제거 및 정렬
        return list(set(all_keywords))[:20]  # 최대 20개
    
    def _extract_keywords_from_text(self, text: str) -> List[str]:
        """일반 텍스트에서 키워드 추출"""
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text)
        # 빈도 기반 키워드 추출
        word_counts = Counter(words)
        return [word for word, count in word_counts.most_common(15)]
    
    async def extract_keywords(self, pdf_path: str) -> Dict:
        """메인 키워드 추출 함수 - Gemini 우선"""
        print(f"📄 PDF 파일 처리 시작: {pdf_path}")
        
        # 1. PDF에서 텍스트 추출
        text = self.extract_text_from_pdf(pdf_path)
        cleaned_text = self.clean_text(text)
        
        if len(cleaned_text) < 100:
            raise Exception("추출된 텍스트가 너무 짧습니다. PDF 파일을 확인해주세요.")
        
        print(f"📝 텍스트 추출 완료: {len(cleaned_text)} 글자")
        
        # 2. Gemini API 시도 (우선순위)
        if self.is_gemini_configured():
            try:
                print("🤖 Gemini API로 키워드 추출 시도...")
                result = await self.extract_with_gemini(cleaned_text)
                print(f"✅ Gemini 추출 성공: {len(result['keywords'])}개 키워드")
                return result
            
            except Exception as e:
                print(f"❌ Gemini API 실패: {str(e)}")
                print("🔄 OpenAI로 폴백 시도...")
        
        # 3. OpenAI API 시도 (폴백)
        if self.is_openai_configured():
            try:
                print("🤖 OpenAI API로 키워드 추출 시도...")
                result = await self.extract_with_openai(cleaned_text)
                print(f"✅ OpenAI 추출 성공: {len(result['keywords'])}개 키워드")
                return result
            
            except Exception as e:
                print(f"❌ OpenAI API 실패: {str(e)}")
                print("🔄 수동 추출 모드로 전환...")
        
        # 4. 수동 추출 방식 실행
        result = self.extract_with_fallback(cleaned_text)
        print(f"✅ 수동 추출 완료: {len(result['keywords'])}개 키워드")
        return result 