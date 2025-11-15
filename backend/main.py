from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import uuid
import shutil
from datetime import datetime, timedelta
import asyncio
from pathlib import Path

from tools.image_to_pdf import convert_images_to_pdf
from tools.merge_pdf import merge_pdfs
from tools.compress_pdf import compress_pdf

app = FastAPI(title="PDF Tools API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
TEMP_DIR = Path("temp")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR.mkdir(parents=True, exist_ok=True)

async def cleanup_old_files():
    """Remove files older than 1 hour"""
    while True:
        try:
            now = datetime.now()
            for directory in [UPLOAD_DIR, TEMP_DIR]:
                for file_path in directory.glob("*"):
                    if file_path.is_file():
                        file_age = now - datetime.fromtimestamp(file_path.stat().st_mtime)
                        if file_age > timedelta(hours=1):
                            file_path.unlink()
        except Exception as e:
            print(f"Cleanup error: {e}")
        await asyncio.sleep(300)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(cleanup_old_files())

@app.get("/")
async def root():
    return {"message": "PDF Tools API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/image-to-pdf")
async def image_to_pdf(files: List[UploadFile] = File(...)):
    """Convert images to PDF"""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}
    uploaded_files = []
    
    try:
        for file in files:
            if not file.filename:
                raise HTTPException(status_code=400, detail="Filename is required")
            
            ext = os.path.splitext(file.filename)[1].lower()
            if ext not in allowed_extensions:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid file type: {file.filename}. Allowed: JPG, PNG, GIF, BMP"
                )
            
            file_id = f"{uuid.uuid4()}{ext}"
            file_path = UPLOAD_DIR / file_id
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            uploaded_files.append(str(file_path))
        
        output_filename = f"{uuid.uuid4()}.pdf"
        output_path = TEMP_DIR / output_filename
        
        convert_images_to_pdf(uploaded_files, str(output_path))
        
        for file_path in uploaded_files:
            Path(file_path).unlink(missing_ok=True)
        
        return FileResponse(
            path=output_path,
            media_type="application/pdf",
            filename="converted.pdf"
        )
    
    except Exception as e:
        for file_path in uploaded_files:
            Path(file_path).unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/merge-pdf")
async def merge_pdf_endpoint(files: List[UploadFile] = File(...)):
    """Merge multiple PDFs into one"""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files required")
    
    uploaded_files = []
    
    try:
        for file in files:
            if not file.filename:
                raise HTTPException(status_code=400, detail="Filename is required")
            
            if not file.filename.lower().endswith('.pdf'):
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file type: {file.filename}. Only PDF files allowed"
                )
            
            file_id = f"{uuid.uuid4()}.pdf"
            file_path = UPLOAD_DIR / file_id
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            uploaded_files.append(str(file_path))
        
        output_filename = f"{uuid.uuid4()}.pdf"
        output_path = TEMP_DIR / output_filename
        
        merge_pdfs(uploaded_files, str(output_path))
        
        for file_path in uploaded_files:
            Path(file_path).unlink(missing_ok=True)
        
        return FileResponse(
            path=output_path,
            media_type="application/pdf",
            filename="merged.pdf"
        )
    
    except Exception as e:
        for file_path in uploaded_files:
            Path(file_path).unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compress-pdf")
async def compress_pdf_endpoint(
    file: UploadFile = File(...),
    dpi: int = 144,
    image_quality: int = 75,
    color_mode: str = "no-change"
):
    """Compress a PDF file with advanced options"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.filename}. Only PDF files allowed"
        )
    
    file_id = f"{uuid.uuid4()}.pdf"
    file_path = UPLOAD_DIR / file_id
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        output_filename = f"{uuid.uuid4()}.pdf"
        output_path = TEMP_DIR / output_filename
        
        compress_pdf(
            str(file_path), 
            str(output_path),
            dpi=dpi,
            image_quality=image_quality,
            color_mode=color_mode
        )
        
        file_path.unlink(missing_ok=True)
        
        return FileResponse(
            path=output_path,
            media_type="application/pdf",
            filename="compressed.pdf"
        )
    
    except Exception as e:
        file_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
