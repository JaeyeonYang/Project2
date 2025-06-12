from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import tempfile
from pathlib import Path
from extractor import KeywordExtractor
from lab_matcher import LabMatcher
from pydantic import BaseModel
from typing import List
import uvicorn
import re

def slugify(text: str):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^\w\-]', '', text)
    return text

app = FastAPI(title="CV Keyword Extractor", version="1.0.0")

# CORS 설정 (Next.js에서 호출 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # 로컬 개발용
        "http://127.0.0.1:3000",      # 로컬 대체
        "http://172.31.131.201:3000", # 네트워크 IP
        "https://*.vercel.app",       # Vercel 배포용
        "https://*.onrender.com"      # Render 배포용
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 업로드 폴더 생성
UPLOAD_DIR = Path("uploaded_files")
UPLOAD_DIR.mkdir(exist_ok=True)

# 키워드 추출기 및 연구실 매칭기 초기화
extractor = KeywordExtractor()
lab_matcher = LabMatcher()
# ID 기반 조회를 위한 딕셔너리 생성
lab_matcher.labs_by_slug = {lab.id: lab for lab in lab_matcher.labs_data}

# 요청 모델 정의
class KeywordSearchRequest(BaseModel):
    keywords: List[str]
    top_n: int = 10

@app.get("/")
async def root():
    return {"message": "CV Keyword Extractor API", "status": "running"}

@app.post("/extract-keywords")
async def extract_keywords(file: UploadFile = File(...)):
    try:
        # PDF 파일만 허용
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400, 
                detail="PDF 파일만 업로드 가능합니다."
            )
        
        # 파일 크기 제한 (10MB)
        file_content = await file.read()
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="파일 크기는 10MB 이하여야 합니다."
            )
        
        # 임시 파일로 저장
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        try:
            # 키워드 추출 실행
            result = await extractor.extract_keywords(temp_file_path)
            
            return JSONResponse(content={
                "success": True,
                "filename": file.filename,
                "extraction_method": result["method"],
                "keywords": result["keywords"],
                "categories": result.get("categories", {}),
                "confidence": result.get("confidence", "unknown")
            })
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"키워드 추출 중 오류가 발생했습니다: {str(e)}"
            )
        
        finally:
            # 임시 파일 삭제
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"파일 처리 중 오류가 발생했습니다: {str(e)}"
        )

@app.post("/recommend-labs")
async def recommend_labs(request: KeywordSearchRequest):
    """키워드 기반 연구실 추천"""
    try:
        if not request.keywords:
            raise HTTPException(
                status_code=400,
                detail="키워드를 입력해주세요."
            )
        
        print(f"🔍 키워드 검색 요청: {request.keywords}")
        
        # 연구실 추천
        recommendations = lab_matcher.get_top_recommendations(
            cv_keywords=request.keywords,
            top_n=request.top_n
        )
        
        return JSONResponse(content={
            "success": True,
            "keywords": request.keywords,
            "total_labs": len(lab_matcher.labs_data),
            "recommendations": recommendations,
            "top_n": min(request.top_n, len(recommendations))
        })
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"추천 처리 중 오류가 발생했습니다: {str(e)}"
        )

@app.get("/lab-by-slug/{slug}")
async def get_lab_by_slug(slug: str):
    """슬러그 기반으로 연구실 상세 정보 조회"""
    try:
        lab = lab_matcher.labs_by_slug.get(slug)
        
        if not lab:
            raise HTTPException(
                status_code=404,
                detail=f"연구실을 찾을 수 없습니다: {slug}"
            )
        
        return JSONResponse(content={
            "success": True,
            "lab": lab
        })
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"연구실 정보 조회 중 오류가 발생했습니다: {str(e)}"
        )

@app.get("/lab/{lab_id}")
async def get_lab_detail(lab_id: str):
    """특정 연구실 상세 정보 조회"""
    try:
        lab = lab_matcher.get_lab_by_id(lab_id)
        
        if not lab:
            raise HTTPException(
                status_code=404,
                detail="연구실을 찾을 수 없습니다."
            )
        
        return JSONResponse(content={
            "success": True,
            "lab": lab
        })
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"연구실 정보 조회 중 오류가 발생했습니다: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": extractor.is_configured(),
        "labs_loaded": len(lab_matcher.labs_data),
        "matching_ready": lab_matcher.lab_embeddings is not None
    }

if __name__ == "__main__":
    print("🚀 CV Keyword Extractor API Server Starting...")
    print("📍 API 문서: http://localhost:8000/docs")
    print("💡 Health Check: http://localhost:8000/health")
    uvicorn.run(app, host="0.0.0.0", port=8000) 