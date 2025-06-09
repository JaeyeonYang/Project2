import json
import os
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re
from pathlib import Path

class LabMatcher:
    def __init__(self):
        self.labs_data = []
        self.vectorizer = None
        self.lab_vectors = None
        self.load_labs_data()
    
    def load_labs_data(self):
        """연구실 데이터 로드"""
        try:
            # DB_addall.py에서 생성된 database 페이지를 파싱해서 연구실 데이터 추출
            database_file = Path("../labfinder/src/app/database/page.tsx")
            
            if database_file.exists():
                self._parse_database_file(database_file)
            else:
                # 직접 텍스트 파일들에서 파싱
                self._parse_txt_files()
            
            print(f"📚 연구실 데이터 로드 완료: {len(self.labs_data)}개 연구실")
            
            if self.labs_data:
                self._prepare_vectors()
        
        except Exception as e:
            print(f"❌ 연구실 데이터 로드 실패: {str(e)}")
            # 기본 더미 데이터
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
                
                self.labs_data = json.loads(json_str)
                print(f"✅ Database 파일에서 {len(self.labs_data)}개 연구실 로드")
        
        except Exception as e:
            print(f"Database 파일 파싱 실패: {str(e)}")
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
        
        # 모든 연구실의 키워드 텍스트
        lab_texts = []
        for lab in self.labs_data:
            text = f"{lab['keywords']} {lab['introduction']}"
            lab_texts.append(text)
        
        # TF-IDF 벡터화
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2),
            lowercase=True
        )
        
        self.lab_vectors = self.vectorizer.fit_transform(lab_texts)
        print(f"✅ {len(lab_texts)}개 연구실 벡터화 완료")
    
    def calculate_similarity(self, cv_keywords: List[str]) -> List[Dict[str, Any]]:
        """CV 키워드와 연구실 키워드 유사도 계산"""
        if not self.labs_data or not self.vectorizer:
            return []
        
        try:
            # CV 키워드를 하나의 텍스트로 합치기
            cv_text = " ".join(cv_keywords)
            
            # CV 텍스트 벡터화
            cv_vector = self.vectorizer.transform([cv_text])
            
            # 코사인 유사도 계산
            similarities = cosine_similarity(cv_vector, self.lab_vectors)[0]
            
            # 결과 정리
            results = []
            for i, lab in enumerate(self.labs_data):
                similarity_score = float(similarities[i])
                
                # 공통 키워드 찾기
                lab_keywords = self._extract_keywords(lab['keywords'])
                common_keywords = self._find_common_keywords(cv_keywords, lab_keywords)
                
                result = {
                    "id": lab["id"],
                    "name": lab["name"],
                    "major": lab["major"],
                    "keywords": lab["keywords"],
                    "introduction": lab["introduction"],
                    "similarity_score": similarity_score,
                    "common_keywords": common_keywords,
                    "match_count": len(common_keywords)
                }
                
                results.append(result)
            
            # 유사도 점수로 정렬 (내림차순)
            results.sort(key=lambda x: x["similarity_score"], reverse=True)
            
            print(f"🎯 {len(results)}개 연구실 매칭 완료")
            return results
        
        except Exception as e:
            print(f"❌ 유사도 계산 실패: {str(e)}")
            return []
    
    def _extract_keywords(self, keyword_text: str) -> List[str]:
        """키워드 텍스트에서 개별 키워드 추출"""
        if not keyword_text:
            return []
        
        # 쉼표로 분리하고 정리
        keywords = [kw.strip().lower() for kw in keyword_text.split(',')]
        return [kw for kw in keywords if kw]
    
    def _find_common_keywords(self, cv_keywords: List[str], lab_keywords: List[str]) -> List[str]:
        """공통 키워드 찾기"""
        cv_set = set([kw.lower().strip() for kw in cv_keywords])
        lab_set = set([kw.lower().strip() for kw in lab_keywords])
        
        # 정확한 매치
        exact_matches = cv_set.intersection(lab_set)
        
        # 부분 매치 (포함 관계)
        partial_matches = set()
        for cv_kw in cv_set:
            for lab_kw in lab_set:
                if cv_kw in lab_kw or lab_kw in cv_kw:
                    if len(cv_kw) > 2 and len(lab_kw) > 2:  # 너무 짧은 단어 제외
                        partial_matches.add(max(cv_kw, lab_kw, key=len))
        
        return list(exact_matches.union(partial_matches))
    
    def get_top_recommendations(self, cv_keywords: List[str], top_n: int = 10) -> List[Dict[str, Any]]:
        """상위 N개 추천 연구실 반환"""
        all_results = self.calculate_similarity(cv_keywords)
        
        # 최소 유사도 임계값 적용 (너무 낮은 점수는 제외)
        filtered_results = [
            result for result in all_results 
            if result["similarity_score"] > 0.01 or result["match_count"] > 0
        ]
        
        return filtered_results[:top_n]
    
    def get_lab_by_id(self, lab_id: str) -> Dict[str, Any]:
        """ID로 특정 연구실 정보 조회"""
        for lab in self.labs_data:
            if lab["id"] == lab_id:
                return lab
        return None 