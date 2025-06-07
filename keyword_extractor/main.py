from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import tempfile
from pathlib import Path
from extractor import KeywordExtractor
import uvicorn

app = FastAPI(title="CV Keyword Extractor", version="1.0.0")

# CORS 설정 (Next.js에서 호출 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 업로드 폴더 생성
UPLOAD_DIR = Path("uploaded_files")
UPLOAD_DIR.mkdir(exist_ok=True)

# 키워드 추출기 초기화
extractor = KeywordExtractor()

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

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "openai_configured": extractor.is_openai_configured(),
        "fallback_ready": True
    }

if __name__ == "__main__":
    print("🚀 CV Keyword Extractor API Server Starting...")
    print("📍 API 문서: http://localhost:8000/docs")
    print("💡 Health Check: http://localhost:8000/health")
    uvicorn.run(app, host="0.0.0.0", port=8000) 