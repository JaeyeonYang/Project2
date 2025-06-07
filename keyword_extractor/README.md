# 🔍 CV 키워드 추출 시스템

ChatGPT API를 활용한 CV 키워드 자동 추출 시스템입니다.

## 🚀 빠른 시작

### 1. Python 환경 설정
```bash
# Python 가상환경 생성 (선택사항)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 의존성 설치
pip install -r requirements.txt
```

### 2. OpenAI API 키 설정
`keyword_extractor` 폴더에 `.env` 파일을 생성하고 다음과 같이 작성:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

> **참고**: API 키가 없어도 폴백 모드로 작동합니다.

### 3. 서버 실행
```bash
# keyword_extractor 폴더에서 실행
cd keyword_extractor
python main.py
```

서버가 시작되면:
- 🌐 API 서버: http://localhost:8000
- 📖 API 문서: http://localhost:8000/docs
- ❤️ Health Check: http://localhost:8000/health

### 4. Next.js 프론트엔드 실행
다른 터미널에서:
```bash
cd labfinder
npm install  # 처음 한 번만
npm run dev
```

- 🖥️ 웹사이트: http://localhost:3000

## 📖 사용법

1. **PDF 업로드**: http://localhost:3000/upload 에서 CV PDF 파일 업로드
2. **키워드 추출**: ChatGPT API 또는 폴백 모드로 자동 추출
3. **결과 확인**: 카테고리별로 정리된 키워드 확인

## 🔧 기능

### ✅ 구현된 기능
- **PDF 텍스트 추출**: PyPDF2 사용
- **ChatGPT API 키워드 추출**: 정확하고 맥락적인 키워드 추출
- **폴백 시스템**: API 실패시 자동으로 수동 추출로 전환
- **카테고리 분류**: 연구분야, 기술스택, 방법론, 응용분야별 분류
- **PDF 전용**: 오류 방지를 위해 PDF 파일만 지원
- **파일 크기 제한**: 10MB 이하 파일만 허용

### 🎯 키워드 카테고리
- **Research Fields**: AI, Machine Learning, Computer Vision 등
- **Technologies**: Python, TensorFlow, PyTorch 등  
- **Methods**: Deep Learning, CNN, Transfer Learning 등
- **Applications**: Medical Imaging, NLP 등

## 🔄 추출 방식

### 1차: ChatGPT API 
- **장점**: 높은 정확도, 맥락 이해
- **모델**: GPT-3.5-turbo
- **비용**: CV 1개당 약 $0.01-0.05

### 2차: 폴백 모드 (API 실패시)
- **사전 기반 매칭**: 미리 정의된 연구 키워드
- **TF-IDF**: 통계적 중요도 기반 키워드
- **무료**: 비용 없음

## 🛠️ API 엔드포인트

### `POST /extract-keywords`
CV PDF 파일에서 키워드 추출

**요청**:
```bash
curl -X POST "http://localhost:8000/extract-keywords" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@your_cv.pdf"
```

**응답**:
```json
{
  "success": true,
  "filename": "cv.pdf",
  "extraction_method": "openai",
  "keywords": ["AI", "Python", "Machine Learning"],
  "categories": {
    "research_fields": ["AI", "Machine Learning"],
    "technologies": ["Python", "TensorFlow"],
    "methods": ["Deep Learning"],
    "applications": ["Computer Vision"]
  },
  "confidence": "high"
}
```

### `GET /health`
서버 및 API 상태 확인

## 🚨 문제 해결

### OpenAI API 관련
```bash
# API 키 확인
curl http://localhost:8000/health
```

### 파일 업로드 오류
- PDF 파일인지 확인
- 파일 크기 10MB 이하 확인
- 한글 파일명 피하기

### 서버 연결 오류
- Python 서버가 8000번 포트에서 실행 중인지 확인
- CORS 설정 확인 (localhost:3000 허용)

## 📁 프로젝트 구조

```
Project2/
├── keyword_extractor/          # Python 백엔드
│   ├── main.py                # FastAPI 서버
│   ├── extractor.py           # 키워드 추출 로직
│   ├── requirements.txt       # Python 의존성
│   ├── .env                   # OpenAI API 키 (생성 필요)
│   └── uploaded_files/        # 임시 파일 저장
└── labfinder/                 # Next.js 프론트엔드
    └── src/app/upload/page.tsx # 업로드 페이지
```

## 🔍 기술 스택

**백엔드**:
- FastAPI (API 서버)
- PyPDF2 (PDF 처리)
- OpenAI API (키워드 추출)
- scikit-learn (TF-IDF)

**프론트엔드**:
- Next.js 14
- TypeScript
- Tailwind CSS

## 💡 개선 가능 사항

- [ ] DOCX, TXT 파일 지원
- [ ] 한국어 키워드 추출 강화
- [ ] 배치 처리 기능
- [ ] 키워드 추천 DB 연동
- [ ] 사용자 피드백 시스템 