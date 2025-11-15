🧰 PDF Tools – Professional Web Application
A modern, fast, multilingual alternative to PDF24 tools.
A comprehensive PDF processing web app powered by FastAPI (Python) and Next.js 14 (React + TypeScript).
 Designed with a clean UI, bilingual support (German/English), and robust backend processing for images and PDFs.

🚀 Overview
This project is inspired by PDF24.org, providing a beautiful, user-friendly set of online PDF tools.
 The current MVP includes 3 fully functional tools:
✔️ Image → PDF
 ✔️ Merge PDF
 ✔️ Compress PDF
All tools are integrated end-to-end with a drag-and-drop interface, background processing, and automatic file cleanup.

🆕 Recent Updates
November 15, 2025
MVP complete with three tools


FastAPI backend with modular tools system


Next.js frontend with drag-and-drop uploader


🇩🇪 German + 🇬🇧 English UI (via next-i18next)


File cleanup system (1-hour auto deletion)


Type safety improvements across metadata & filenames


Smooth loading indicators for page transitions


Unified segmented toggle for language switching



🏗️ Project Architecture
🔧 Backend — FastAPI (Python)
Directory: backend/
 Port: 8000
 Built with: FastAPI, Uvicorn, Pillow, PyPDF2
Features:
Image → PDF conversion (JPG, PNG, GIF, BMP)


PDF merge (multi-file support)


PDF compression


Async processing


Automatic file cleanup after 1 hour


CORS enabled for Next.js integration


Strong filename validation & error handling



💻 Frontend — Next.js 14
Directory: frontend/
 Port: 5000
 Built with: Next.js 14, React 18, TypeScript, Tailwind CSS
Features:
Drag-and-drop uploader


Real-time progress UI


🇩🇪 German / 🇬🇧 English language toggle


Responsive modern interface (PDF24 style)


Reusable FileUploader component


Clean, minimal, production-ready design



📂 Key Files & Structure
backend/
 ├── main.py                # FastAPI server / API routing
 ├── tools/                 # PDF processing modules
 └── uploads/               # Temporary file storage
frontend/
 ├── pages/                 # Next.js pages (one per tool)
 ├── components/            # Shared UI components
 └── public/locales/        # i18n language files (de/en)


📡 API Endpoints
POST /api/image-to-pdf
Convert uploaded images into a single PDF.
 Accepts: JPG, PNG, GIF, BMP
 Returns: Generated PDF

POST /api/merge-pdf
Merge 2 or more PDFs into one.
 Accepts: multiple PDF files
 Returns: merged PDF

POST /api/compress-pdf
Compress a single PDF.
 Accepts: 1 PDF file
 Returns: compressed PDF

🔒 Security & Privacy
All file transfers are encrypted


No permanent storage


Automatic cleanup after 1 hour


GDPR-compliant processing


Filename validation to prevent malicious uploads



🛠️ Development
▶️ Run Local Environment
Frontend + Backend together:
 Use the project workflow:
pdf-tools

Or manually:
# Backend
cd backend
python main.py

# Frontend
cd frontend
npm run dev


📦 Dependencies
Backend
fastapi==0.109.0
uvicorn[standard]==0.27.0
Pillow==10.2.0
PyPDF2==3.0.1
python-multipart==0.0.6
aiofiles==23.2.1

Frontend
next@14.1.0
react@18.2.0
axios@1.6.5
react-dropzone@14.2.3
next-i18next@15.2.0
tailwindcss@3.4.1


🔜 Roadmap (Next Phase)
Integrate Celery + Redis for background processing


Add additional tools:


Split PDF


Rotate PDF


Extract pages


OCR


User accounts + processing history


Full SEO optimization (Focus: German market 🇩🇪)


Deploy to Hetzner with NGINX & SSL


Production-grade logging & monitoring


Load testing & performance optimization



🌍 Deployment Target
Server: Hetzner Cloud (Germany)


Backend: FastAPI (Uvicorn)


Frontend: Next.js on Node


Proxy & SSL: NGINX



📝 Notes
Frontend runs on port 5000


Backend runs on port 8000


All temporary files stored in backend/uploads/ and backend/temp/


All TypeScript and LSP errors fixed


UI modeled after PDF24 but fully original implementation



