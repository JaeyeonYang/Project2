import json
import os
import logging
from typing import List, Dict, Any
from pathlib import Path
import re
import json5
from sentence_transformers import SentenceTransformer, util

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)  # DEBUG 레벨로 변경하여 더 자세한 로그 확인
logger = logging.getLogger(__name__)


class LabMatcher:
    def __init__(
        self,
        data_path: str = "../labfinder/src/app/database/labsData.ts",  # 상대 경로 수정
        model_name: str = 'all-mpnet-base-v2'
    ):
        # 1) 데이터 경로 설정
        self.data_path = os.path.abspath(data_path)
        logger.info(f"Looking for lab data at: {self.data_path}")
        self.labs_data: List[Dict[str, Any]] = []

        # 2) SBERT 모델 로드
        logger.info(f"Loading SBERT model '{model_name}'...")
        self.sbert = SentenceTransformer(model_name)
        self.lab_embeddings = None

        # 3) 데이터 파싱 & 임베딩
        self.load_labs_data()
        if not self.labs_data:
            logger.warning("No lab data found, loading dummy data...")
            self._load_dummy_data()
        self._prepare_embeddings()

    def load_labs_data(self):
        """Load lab data from TypeScript file"""
        try:
            ts_file = Path(self.data_path)
            if not ts_file.exists():
                logger.error(f"Data file not found: {ts_file}")
                return

            content = ts_file.read_text(encoding='utf-8')
            logger.debug(f"File content length: {len(content)}")
            
            # TypeScript 파일에서 JSON 데이터 추출
            pattern = re.compile(
                r'export\s+const\s+labs\s*:\s*Lab\[\]\s*=\s*'
                r'(\[\s*[\s\S]*?\])\s*;',
                re.MULTILINE
            )
            m = pattern.search(content)
            if not m:
                logger.error("No lab data pattern found in file")
                return

            json_str = m.group(1)
            logger.debug(f"Extracted JSON string length: {len(json_str)}")
            
            # json5로 파싱 (더 유연한 JSON 파싱)
            self.labs_data = json5.loads(json_str)
            logger.info(f"Successfully loaded {len(self.labs_data)} labs")
            logger.debug(f"First lab data: {self.labs_data[0] if self.labs_data else 'No labs'}")
            
        except Exception as e:
            logger.error(f"Error loading lab data: {str(e)}")
            self.labs_data = []

    def _load_dummy_data(self):
        """Load dummy data if no real data is available"""
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
        """Prepare SBERT embeddings for all labs"""
        if not self.labs_data:
            logger.error("No lab data available for embedding")
            return

        try:
            # Combine major, keywords, and introduction for better matching
            lab_texts = []
            for lab in self.labs_data:
                text_parts = [
                    lab.get('major', ''),
                    lab.get('keywords', ''),
                    lab.get('introduction', '')
                ]
                lab_texts.append(' '.join(filter(None, text_parts)))
                logger.debug(f"Prepared text for lab {lab.get('name')}: {text_parts}")

            logger.info(f"Encoding {len(lab_texts)} lab descriptions...")
            self.lab_embeddings = self.sbert.encode(
                lab_texts,
                convert_to_tensor=True,
                show_progress_bar=True
            )
            logger.info("Lab embeddings prepared successfully")
        except Exception as e:
            logger.error(f"Error preparing embeddings: {str(e)}")
            self.lab_embeddings = None

    def calculate_similarity(
        self,
        cv_keywords: List[str],
        user_major: str = ""
    ) -> List[Dict[str, Any]]:
        """Calculate similarity between CV and labs"""
        if self.lab_embeddings is None:
            logger.error("Lab embeddings not available")
            return []

        try:
            # Combine user major and keywords
            cv_text = f"{user_major} {' '.join(cv_keywords)}"
            logger.info(f"Calculating similarity for: {cv_text}")

            # Get CV embedding
            cv_emb = self.sbert.encode(cv_text, convert_to_tensor=True)

            # Calculate cosine similarity
            cosine_scores = util.cos_sim(cv_emb, self.lab_embeddings)[0]
            scores = cosine_scores.cpu().numpy()

            # Prepare results
            results = []
            for idx, lab in enumerate(self.labs_data):
                if scores[idx] > 0.05:  # 임계값 낮춤
                    results.append({
                        "id": lab.get("id"),
                        "name": lab.get("name"),
                        "major": lab.get("major"),
                        "keywords": lab.get("keywords", ""),
                        "introduction": lab.get("introduction", ""),
                        "similarity_score": float(scores[idx])
                    })
                    logger.debug(f"Lab {lab.get('name')} score: {scores[idx]:.4f}")

            # Sort by similarity score
            results.sort(key=lambda x: x["similarity_score"], reverse=True)
            logger.info(f"Found {len(results)} matching labs")
            return results

        except Exception as e:
            logger.error(f"Error calculating similarity: {str(e)}")
            return []

    def get_top_recommendations(
        self,
        cv_keywords: List[str],
        user_major: str = "",
        top_n: int = 10
    ) -> List[Dict[str, Any]]:
        """Get top N lab recommendations"""
        results = self.calculate_similarity(cv_keywords, user_major)
        return results[:top_n] if results else []

    def get_lab_by_id(self, lab_id: str) -> Dict[str, Any]:
        """Get lab information by ID"""
        for lab in self.labs_data:
            if lab.get("id") == lab_id:
                return lab
        return None


if __name__ == "__main__":
    # Test code
    matcher = LabMatcher()
    sample_keywords = ["nanotechnology", "single cell proteomics", "NEMS"]
    tops = matcher.get_top_recommendations(sample_keywords, user_major="Bioengineering", top_n=5)
    for lab in tops:
        print(f"{lab['name']} ({lab['major']}): {lab['similarity_score']:.4f}")
