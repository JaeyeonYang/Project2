import json
import os
import logging
from typing import List, Dict, Any
from pathlib import Path
import re
import json5
from sentence_transformers import SentenceTransformer, util

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LabMatcher:
    def __init__(
        self,
        data_path: str = "labfinder\src\app\database\labsData.ts",
        model_name: str = 'all-mpnet-base-v2'
    ):
        # 1) 고정된 경로로만 데이터로드
        self.data_path = data_path
        self.labs_data: List[Dict[str, Any]] = []

        # 2) SBERT 모델 로드
        logger.info(f"Loading SBERT model '{model_name}'...")
        self.sbert = SentenceTransformer(model_name)
        self.lab_embeddings = None

        # 3) 데이터 파싱 & 임베딩
        self.load_labs_data()
        if self.labs_data:
            self._prepare_embeddings()
        else:
            logger.error("No lab data found; embeddings cannot be prepared.")

    def load_labs_data(self):
        ts_file = Path(self.data_path)
        if not ts_file.exists():
            print(f"Data file not found: {ts_file}")
            return

        content = ts_file.read_text(encoding='utf-8')

        pattern = re.compile(
            r'export\s+const\s+labs\s*:\s*Lab\[\]\s*=\s*'
            r'(\[\s*[\s\S]*?\])\s*;',
            re.MULTILINE
        )
        m = pattern.search(content)
        if not m:
            print("No match found")
        
            return

        json_str = m.group(1)
        # json5 로드: 후행 콤마도, 주석도, 싱글퀘이트도 OK
        try:
            self.labs_data = json5.loads(json_str)
            logger.info(f"Loaded {len(self.labs_data)} labs via json5")
            print(self.labs_data)
        except Exception as e:
            logger.error(f"json5 parsing failed: {e}")
            print(f"json5 parsing failed: {e}")

    def _load_dummy_data(self):
        """파싱 실패 시 기본 더미 데이터"""
        logger.info("Loading dummy lab data...")
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

    def _prepare_embeddings(self):
        """SBERT 임베딩 생성"""
        lab_texts = [
            f"{lab['major']} {lab.get('keywords','')} {lab.get('introduction','')}"
            for lab in self.labs_data
        ]
        logger.info(f"Encoding {len(lab_texts)} lab descriptions with SBERT...")
        self.lab_embeddings = self.sbert.encode(
            lab_texts,
            convert_to_tensor=True,
            show_progress_bar=False
        )
        logger.info("Lab embeddings ready.")

    def calculate_similarity(
        self,
        cv_keywords: List[str],
        user_major: str = ""
    ) -> List[Dict[str, Any]]:
        """SBERT 기반 유사도 계산"""
        if self.lab_embeddings is None:
            logger.error("Lab embeddings not initialized.")
            return []

        # CV 문장 임베딩
        cv_text = f"{user_major} " + " ".join(cv_keywords)
        logger.info("Encoding CV text with SBERT...")
        cv_emb = self.sbert.encode(cv_text, convert_to_tensor=True)

        # 코사인 유사도
        cosine_scores = util.cos_sim(cv_emb, self.lab_embeddings)[0]
        scores = cosine_scores.cpu().numpy()

        # 결과 정리
        results = []
        for idx, lab in enumerate(self.labs_data):
            results.append({
                "id": lab.get("id"),
                "name": lab.get("name"),
                "major": lab.get("major"),
                "keywords": lab.get("keywords", ""),
                "introduction": lab.get("introduction", ""),
                "similarity_score": float(scores[idx])
            })

        # 점수 순 정렬
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results

    def get_top_recommendations(
        self,
        cv_keywords: List[str],
        user_major: str = "",
        top_n: int = 10
    ) -> List[Dict[str, Any]]:
        """상위 N개 추천 연구실 반환"""
        all_results = self.calculate_similarity(cv_keywords, user_major)
        return all_results[:top_n]

    def get_lab_by_id(self, lab_id: str) -> Dict[str, Any]:
        """ID로 특정 연구실 정보 조회"""
        for lab in self.labs_data:
            if lab.get("id") == lab_id:
                return lab
        return None


if __name__ == "__main__":
    # 테스트 코드
    matcher = LabMatcher()
    sample_keywords = ["nanotechnology", "single cell proteomics", "NEMS"]
    tops = matcher.get_top_recommendations(sample_keywords, user_major="Bioengineering", top_n=5)
    for lab in tops:
        print(f"{lab['name']} ({lab['major']}): {lab['similarity_score']:.4f}")
