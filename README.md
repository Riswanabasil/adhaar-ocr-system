# Aadhaar OCR System (MERN)

A simple MERN app that extracts details from Aadhaar card images using sharp (preprocessing) and tesseract.js (OCR).  
Frontend lets you upload front and back images, triggers parse, and shows parsed fields + raw OCR.

## Features
- Upload front & back images (preview)
- Immediate parse in one request (no DB)
- Sharp-based preprocessing 
- Tesseract.js OCR 
- Regex/heuristics to extract: Aadhaar No, DOB/Year, Gender, Pincode, Name, Address
- Clean, responsive UI (Vite + React + Tailwind)

## Tech Stack
- **Frontend:** Vite + React (TypeScript), Tailwind CSS, Axios, ESLint
- **Backend:** Node + Express, Multer, Sharp, Tesseract.js, Helmet, CORS
- **No database** (stateless API)



