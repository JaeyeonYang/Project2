import json
import os
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re
from pathlib import Path
from difflib import SequenceMatcher
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import nltk
from collections import Counter
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# NLTK 데이터 다운로드
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class LabMatcher:
    def __init__(self, data_path: str = None):
        self.labs_data = []
        self.vectorizer = None
        self.lab_vectors = None
        self.stop_words = set(stopwords.words('english'))
        self.data_path = data_path or os.path.join(os.path.dirname(__file__), '..', 'labfinder', 'src', 'app', 'database', 'page.tsx')
        self.load_labs_data()
    
    def load_labs_data(self):
        """연구실 데이터 로드"""
        try:
            database_file = Path(self.data_path)
            
            if database_file.exists():
                self._parse_database_file(database_file)
            else:
                logger.warning(f"Database file not found at {database_file}")
                self._parse_txt_files()
            
            logger.info(f"Loaded {len(self.labs_data)} labs")
            
            if self.labs_data:
                self._prepare_vectors()
            else:
                logger.warning("No lab data available, loading dummy data")
                self._load_dummy_data()
        
        except Exception as e:
            logger.error(f"Failed to load lab data: {str(e)}")
            self._load_dummy_data()
    
    def _parse_database_file(self, file_path):
        """database/page.tsx 파일에서 연구실 데이터 파싱"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # JSON 데이터 부분 추출
            start_marker = 'const labs: Lab[] = '
            end_marker = '];'
            
            start_idx = content.find(start_marker)
            if start_idx != -1:
                start_idx += len(start_marker)
                end_idx = content.find(end_marker, start_idx) + 1
                json_str = content[start_idx:end_idx]
                
                # JSON 파싱 전에 데이터 정리
                json_str = json_str.replace("'", '"')  # 작은따옴표를 큰따옴표로 변경
                
                try:
                    self.labs_data = json.loads(json_str)
                    logger.info(f"Successfully loaded {len(self.labs_data)} labs from database file")
                except json.JSONDecodeError as e:
                    logger.error(f"JSON parsing error: {str(e)}")
                    logger.error(f"Problematic JSON string: {json_str[:200]}...")  # 처음 200자만 로깅
                    self._parse_txt_files()
            else:
                logger.warning("Could not find labs data in database file")
                self._parse_txt_files()
        
        except Exception as e:
            logger.error(f"Database file parsing failed: {str(e)}")
            self._parse_txt_files()
    
    def _parse_txt_files(self):
        """직접 txt 파일들에서 데이터 파싱"""
        print("📁 TXT 파일들에서 직접 파싱...")
        
        # 상위 디렉토리의 txt 파일들 찾기
        parent_dir = Path("../")
        txt_files = list(parent_dir.glob("*.txt"))
        
        lab_id_counter = 1
        
        for txt_file in txt_files:
            try:
                with open(txt_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # "Professor:" 기준으로 나누기
                entries = content.split("Professor:")[1:]
                
                major_name = txt_file.stem.replace("_", " ").title()
                
                for entry in entries:
                    lines = entry.strip().split('\n')
                    if not lines:
                        continue
                    
                    name = lines[0].strip()
                    keywords = ""
                    introduction = ""
                    current_section = None
                    
                    for line in lines[1:]:
                        line = line.strip()
                        if line == "Analysis:":
                            current_section = "analysis"
                            continue
                        elif line == "Introduction:":
                            current_section = "introduction"
                            continue
                        elif not line:
                            continue
                        
                        if current_section == "analysis":
                            keywords += line + ", "
                        elif current_section == "introduction":
                            introduction += line + " "
                    
                    lab = {
                        "id": f"lab-{lab_id_counter}",
                        "name": name,
                        "major": major_name,
                        "keywords": keywords.strip(", "),
                        "introduction": introduction.strip()
                    }
                    
                    self.labs_data.append(lab)
                    lab_id_counter += 1
            
            except Exception as e:
                print(f"파일 {txt_file} 파싱 실패: {str(e)}")
    
    def _load_dummy_data(self):
        """더미 데이터 로드 (백업용)"""
        self.labs_data = [
            {
                "id": "dummy-1",
                "name": "AI Research Lab",
                "major": "Computer Science",
                "keywords": "artificial intelligence, machine learning, deep learning, neural networks, computer vision",
                "introduction": "Leading research in artificial intelligence and machine learning applications."
            },
            {
                "id": "dummy-2", 
                "name": "Robotics Lab",
                "major": "Mechanical Engineering",
                "keywords": "robotics, autonomous systems, control systems, sensor fusion, navigation",
                "introduction": "Advanced robotics research focusing on autonomous navigation and manipulation."
            }
        ]
        print("🔄 더미 데이터로 초기화")
    
    def _prepare_vectors(self):
        """연구실 키워드 벡터화"""
        if not self.labs_data:
            return
        
        # 연구실 정보를 구조화된 형태로 변환
        lab_texts = []
        for lab in self.labs_data:
            # 각 섹션별 가중치를 다르게 적용
            sections = {
                'keywords': 2.0,  # 키워드에 가장 높은 가중치
                'introduction': 1.5,  # 소개문에 중간 가중치
                'major': 1.0,  # 학과에 기본 가중치
                'university': 0.5  # 대학에 낮은 가중치
            }
            
            # 각 섹션을 가중치에 따라 반복
            text_parts = []
            for section, weight in sections.items():
                if section in lab:
                    # 가중치에 따라 섹션을 반복
                    text_parts.extend([lab[section]] * int(weight))
            
            lab_texts.append(' '.join(text_parts))
        
        # TF-IDF 벡터화 파라미터 최적화
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 3),  # 1-3 단어 조합까지 고려
            lowercase=True,
            min_df=1,
            max_df=0.9,
            sublinear_tf=True,  # 로그 스케일링
            use_idf=True,
            smooth_idf=True,
            norm='l2'
        )
        
        self.lab_vectors = self.vectorizer.fit_transform(lab_texts)
        logger.info(f"Vectorized {len(lab_texts)} labs")
    
    def _find_common_keywords(self, cv_keywords: List[str], lab_keywords: List[str]) -> List[str]:
        """개선된 공통 키워드 찾기 (더욱 완화된 버전)"""
        cv_set = set([kw.lower().strip() for kw in cv_keywords])
        lab_set = set([kw.lower().strip() for kw in lab_keywords])
        
        # 정확한 매치
        exact_matches = cv_set.intersection(lab_set)
        
        # 부분 매치 (더욱 완화된 알고리즘)
        partial_matches = set()
        
        # 1. 문자열 유사도 기반 매칭 (임계값 더 낮춤)
        for cv_kw in cv_set:
            for lab_kw in lab_set:
                # SequenceMatcher를 사용한 문자열 유사도 계산
                similarity = SequenceMatcher(None, cv_kw, lab_kw).ratio()
                if similarity > 0.3:  # 50%에서 30%로 낮춤
                    partial_matches.add(max(cv_kw, lab_kw, key=len))
                # 포함 관계 확인 (더욱 유연하게)
                elif any(token in lab_kw for token in cv_kw.split()) or any(token in cv_kw for token in lab_kw.split()):
                    partial_matches.add(max(cv_kw, lab_kw, key=len))
        
        # 2. 토큰화 기반 매칭 (더욱 유연하게)
        cv_tokens = set()
        lab_tokens = set()
        
        for kw in cv_set:
            cv_tokens.update(word_tokenize(kw.lower()))
        for kw in lab_set:
            lab_tokens.update(word_tokenize(kw.lower()))
        
        # 불용어 제거
        cv_tokens = cv_tokens - self.stop_words
        lab_tokens = lab_tokens - self.stop_words
        
        # 토큰 기반 매칭 (더욱 유연하게)
        token_matches = cv_tokens.intersection(lab_tokens)
        for token in token_matches:
            # 토큰이 포함된 원래 키워드 찾기
            for cv_kw in cv_set:
                if token in cv_kw:
                    partial_matches.add(cv_kw)
            for lab_kw in lab_set:
                if token in lab_kw:
                    partial_matches.add(lab_kw)
        
        return list(exact_matches.union(partial_matches))
    
    def _calculate_similarity_scores(self, cv_keywords: List[str], lab: Dict[str, Any]) -> Tuple[float, float, float, float]:
        """각 유사도 점수 계산 (더욱 완화된 버전)"""
        # 1. 키워드 매칭 점수
        lab_keywords = self._extract_keywords(lab['keywords'])
        common_keywords = self._find_common_keywords(cv_keywords, lab_keywords)
        keyword_score = len(common_keywords) / max(len(cv_keywords), len(lab_keywords))
        
        # 2. 연구 분야 매칭 점수 (더욱 완화)
        research_score = 0.0
        for cv_kw in cv_keywords:
            for lab_kw in lab_keywords:
                similarity = SequenceMatcher(None, cv_kw.lower(), lab_kw.lower()).ratio()
                if similarity > 0.3:  # 0.4에서 0.3으로 낮춤
                    research_score += 1.0
                # 부분 일치도 고려 (더 많은 점수)
                elif any(token in lab_kw.lower() for token in cv_kw.lower().split()):
                    research_score += 0.7
        research_score = min(research_score / len(cv_keywords), 1.0)
        
        # 3. 학과 매칭 점수 (더욱 완화)
        major_score = 0.0
        for kw in cv_keywords:
            if kw.lower() in lab['major'].lower():
                major_score = 1.0
                break
            # 부분 일치도 고려 (더 많은 점수)
            elif any(token in lab['major'].lower() for token in kw.lower().split()):
                major_score = 0.7
                break
        
        # 4. 대학 매칭 점수 (더욱 완화)
        university_score = 0.0
        for kw in cv_keywords:
            if kw.lower() in lab['university'].lower():
                university_score = 0.7
                break
            # 부분 일치도 고려 (더 많은 점수)
            elif any(token in lab['university'].lower() for token in kw.lower().split()):
                university_score = 0.4
                break
        
        return keyword_score, research_score, major_score, university_score
    
    def calculate_similarity(self, cv_keywords: List[str]) -> List[Dict[str, Any]]:
        """CV 키워드와 연구실 키워드 유사도 계산"""
        if not self.labs_data or not self.vectorizer:
            logger.warning("No lab data or vectorizer available")
            return []
        
        try:
            # CV 키워드를 문맥을 고려하여 결합
            cv_text = ' '.join(cv_keywords)
            cv_vector = self.vectorizer.transform([cv_text])
            
            # 코사인 유사도 계산
            similarities = cosine_similarity(cv_vector, self.lab_vectors)[0]
            
            results = []
            for i, lab in enumerate(self.labs_data):
                # 기본 유사도 점수
                base_similarity = float(similarities[i])
                
                # 세부 유사도 점수 계산
                keyword_score, research_score, major_score, university_score = self._calculate_similarity_scores(cv_keywords, lab)
                
                # 최종 점수 계산 (가중치 조정)
                final_score = (
                    base_similarity * 0.3 +  # 기본 유사도
                    keyword_score * 0.3 +  # 키워드 매칭
                    research_score * 0.2 +  # 연구 분야 매칭
                    major_score * 0.15 +  # 학과 매칭
                    university_score * 0.05  # 대학 매칭
                )
                
                # 디버깅을 위한 로깅
                logger.debug(f"Lab: {lab['name']}, Final Score: {final_score:.3f}, Base: {base_similarity:.3f}, "
                           f"Keyword: {keyword_score:.3f}, Research: {research_score:.3f}")
                
                result = {
                    "id": lab["id"],
                    "name": lab["name"],
                    "major": lab["major"],
                    "university": lab["university"],
                    "keywords": lab["keywords"],
                    "introduction": lab["introduction"],
                    "similarity_score": final_score,
                    "base_similarity": base_similarity,
                    "keyword_score": keyword_score,
                    "research_score": research_score,
                    "major_score": major_score,
                    "university_score": university_score,
                    "common_keywords": self._find_common_keywords(cv_keywords, self._extract_keywords(lab['keywords'])),
                    "match_count": len(self._find_common_keywords(cv_keywords, self._extract_keywords(lab['keywords'])))
                }
                
                results.append(result)
            
            # 최종 점수로 정렬
            results.sort(key=lambda x: x["similarity_score"], reverse=True)
            logger.info(f"Calculated similarity for {len(results)} labs")
            return results
        
        except Exception as e:
            logger.error(f"Failed to calculate similarity: {str(e)}")
            return []
    
    def _extract_keywords(self, keyword_text: str) -> List[str]:
        """키워드 텍스트에서 개별 키워드 추출"""
        if not keyword_text:
            return []
        
        # 쉼표로 분리하고 정리
        keywords = [kw.strip().lower() for kw in keyword_text.split(',')]
        return [kw for kw in keywords if kw]
    
    def get_top_recommendations(self, cv_keywords: List[str], top_n: int = 10) -> List[Dict[str, Any]]:
        """상위 N개 추천 연구실 반환 (더욱 완화된 버전)"""
        all_results = self.calculate_similarity(cv_keywords)
        
        if not all_results:
            logger.warning("No results found in similarity calculation")
            return []
        
        # 최소 유사도 임계값 적용 (더욱 낮춤)
        filtered_results = [
            result for result in all_results 
            if result["similarity_score"] > 0.0001 or result["match_count"] > 0  # 0.001에서 0.0001로 낮춤
        ]
        
        logger.info(f"Filtered results: {len(filtered_results)} labs after threshold")
        
        if len(filtered_results) <= top_n:
            return filtered_results
        
        # 대학별 그룹화 및 선택
        university_groups = {}
        for result in filtered_results:
            university = result["university"]
            if university not in university_groups:
                university_groups[university] = []
            university_groups[university].append(result)
        
        # 각 대학에서 최대 4개씩 선택 (3개에서 4개로 증가)
        selected_results = []
        remaining_slots = top_n
        
        # 1. 각 대학에서 상위 결과 선택
        for university, results in university_groups.items():
            if remaining_slots > 0:
                selected_count = min(4, len(results), remaining_slots)  # 3에서 4로 증가
                selected_results.extend(results[:selected_count])
                remaining_slots -= selected_count
        
        # 2. 남은 자리 채우기
        if remaining_slots > 0:
            remaining_results = [
                result for result in filtered_results 
                if result not in selected_results
            ]
            selected_results.extend(remaining_results[:remaining_slots])
        
        # 최종 결과 정렬
        selected_results.sort(key=lambda x: x["similarity_score"], reverse=True)
        logger.info(f"Final recommendations: {len(selected_results)} labs")
        return selected_results
    
    def get_lab_by_id(self, lab_id: str) -> Dict[str, Any]:
        """ID로 특정 연구실 정보 조회"""
        for lab in self.labs_data:
            if lab["id"] == lab_id:
                return lab
        return None 