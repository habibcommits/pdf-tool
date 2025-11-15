# PDF Tools - Professional Web Application

## Overview
A comprehensive PDF tools web application inspired by PDF24.org, providing free and easy-to-use online PDF processing capabilities. The application features a FastAPI backend for robust PDF processing and a Next.js frontend with German/English language support.

**Current State:** Fully functional MVP with three core tools implemented and tested.

## Recent Changes
- **November 15, 2025:** Initial implementation complete
  - Backend API with three PDF processing tools
  - Next.js frontend with drag-and-drop interface
  - German and English language support via next-i18next
  - Automatic file cleanup system
  - Fixed critical type safety issues with filename validation and metadata handling
  - Added loading indicators for page transitions and file processing
  - Improved language toggle with unified segmented control design

## Project Architecture

### Backend (Python FastAPI)
- **Location:** `backend/`
- **Port:** 8000
- **Tech Stack:** FastAPI, Uvicorn, Pillow, PyPDF2
- **Features:**
  - Image to PDF conversion (JPG, PNG, GIF, BMP)
  - PDF merging (multiple PDFs into one)
  - PDF compression
  - Automatic file cleanup (1-hour retention)
  - CORS enabled for frontend integration
  - Robust error handling with filename validation

### Frontend (Next.js)
- **Location:** `frontend/`
- **Port:** 5000
- **Tech Stack:** Next.js 14, React, Tailwind CSS, TypeScript
- **Features:**
  - Drag-and-drop file upload interface
  - Real-time progress indicators
  - German/English language switching
  - Responsive design
  - Clean, modern UI inspired by PDF24

### Key Files
- `backend/main.py` - FastAPI server with API endpoints
- `backend/tools/` - PDF processing modules
- `frontend/pages/` - Next.js pages for each tool
- `frontend/components/FileUploader.tsx` - Reusable upload component
- `frontend/public/locales/` - i18n translations (de/en)

## User Preferences
- **Deployment Target:** External infrastructure (Hetzner server in Germany)
- **Language:** Primary German market with English fallback
- **Design Reference:** PDF24.org aesthetic and functionality

## Development

### Running Locally
The workflow `pdf-tools` starts both servers:
- Backend: `cd backend && python main.py`
- Frontend: `cd frontend && npm run dev`

### Dependencies
**Backend:**
- fastapi==0.109.0
- uvicorn[standard]==0.27.0
- Pillow==10.2.0
- PyPDF2==3.0.1
- python-multipart==0.0.6
- aiofiles==23.2.1

**Frontend:**
- next@14.1.0
- react@18.2.0
- axios@1.6.5
- react-dropzone@14.2.3
- next-i18next@15.2.0
- tailwindcss@3.4.1

## API Endpoints

### POST /api/image-to-pdf
Converts images to a single PDF
- **Input:** Multiple image files (JPG, PNG, GIF, BMP)
- **Output:** PDF file download

### POST /api/merge-pdf
Merges multiple PDFs into one
- **Input:** 2+ PDF files
- **Output:** Merged PDF file download

### POST /api/compress-pdf
Compresses a PDF file
- **Input:** Single PDF file
- **Output:** Compressed PDF file download

## Security & Privacy
- All file transfers encrypted
- Automatic file deletion after 1 hour
- No permanent storage of user files
- GDPR-compliant file handling
- Filename validation to prevent malicious uploads

## Next Phase (For External Deployment)
1. Add Celery + Redis for background task processing
2. Implement additional PDF tools (split, rotate, extract pages, OCR)
3. Add user accounts and processing history
4. Comprehensive SEO optimization for German market
5. Deploy to Hetzner server with NGINX and SSL
6. Performance and security testing
7. Production monitoring and logging

## Technical Notes
- Frontend runs on port 5000 (Replit webview requirement)
- Backend runs on port 8000
- Next.js configured to allow all hosts for iframe compatibility
- Temporary files stored in `backend/uploads/` and `backend/temp/`
- Type-safe implementation with all LSP errors resolved
