# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KISARA is a React-based web application that converts Excel files to PowerPoint presentations. Users can upload Excel files, customize presentation slides, and generate downloadable PowerPoint files. The application features a modern dark theme with orange accent colors (#e99b63).

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### Frontend-Only Structure
This is a frontend-only React application using Vite. The backend integration is prepared but not implemented - all backend API calls (to `localhost:8000` and `/api/*`) will currently fail.

### Key Technologies
- **React 19** with functional components and hooks
- **React Router DOM** for client-side routing
- **Vite** for development and build tooling
- **Tailwind CSS** for styling
- **Boxicons** for icons

### Application Flow
1. **Home (/)** - Landing page with introduction and navigation buttons
2. **Upload (/upload)** - File upload interface with drag-and-drop
3. **Process (/process)** - Slide customization and PowerPoint generation

### Component Architecture

**App.jsx** - Main router component with three routes:
- Home route renders Header + Body components with gradient background
- Upload and Process routes render as full-page components

**State Management Pattern:**
- Local component state with useState hooks
- localStorage for data persistence between routes
- Project data stored as: `localStorage.setItem('currentProject', JSON.stringify({...}))`

**Key Data Flow:**
1. Upload component stores file info and fileId in localStorage
2. Process component reads from localStorage to load project data
3. Process component makes API calls to fetch Excel data and generate PowerPoint

### Styling Patterns
- Dark theme with black background (`bg-black`)
- Primary accent color: `#e99b63` (orange)
- Secondary grays: `#1a1a1a`, `#2a2a2a`, `#a7a7a7`
- Consistent border radius: `rounded-full` for buttons, `rounded-lg` for panels
- Hover effects with `transition-all duration-300`

### API Integration (Not Implemented)
The app expects these backend endpoints:
- `POST /api/upload` - Upload Excel files
- `DELETE /api/upload/{fileId}` - Delete uploaded files  
- `GET http://localhost:8000/api/files/{fileId}/data` - Get Excel sheet data
- `POST http://localhost:8000/api/generate-ppt` - Generate PowerPoint

### Navigation Pattern
- Uses React Router's `useNavigate()` hook
- Programmatic navigation in click handlers
- Back buttons navigate to previous routes
- Route protection: Process page redirects to Upload if no file uploaded

## Key Files

- `src/App.jsx` - Main router and route definitions
- `src/components/Header.jsx` - Navigation header with mobile menu and instructions popup
- `src/components/Body.jsx` - Landing page content with CTA buttons  
- `src/components/Upload.jsx` - File upload with drag-and-drop and validation
- `src/components/Process.jsx` - Slide customization interface with live preview

Project Report

Abstract

This report documents the development of a data processing and visualization website. The system is designed with a React-based frontend and a FastAPI backend. Users can upload Excel files, process the data locally, and generate PowerPoint reports containing relevant graphs. The system does not require user login, and no SQL database is used; instead, all file processing is handled directly on the local server.

Table of Contents

Introduction

System Requirements

System Architecture

Frontend Design

Backend Design with FastAPI

Data Processing Workflow

PowerPoint Generation

Testing and Validation

Security Considerations

Future Improvements

Conclusion

References

1. Introduction

This project provides a lightweight, user-friendly website that allows users to upload Excel files, process the data, and generate visual PowerPoint reports. With the adoption of FastAPI as the backend, the system achieves efficiency, scalability, and simplicity in handling file processing and returning downloadable results.

2. System Requirements

Frontend: React (HTML, CSS, JavaScript, TailwindCSS)

Backend: FastAPI (Python-based web framework)

File Handling: Local server storage (temporary, non-persistent)

Output: PowerPoint reports with charts

Hosting: Local or cloud deployment (optional)

3. System Architecture

The architecture consists of two main components:

Frontend: Built with React, enabling file upload and download interactions.

Backend (FastAPI): Handles requests, processes Excel files, generates graphs, and creates PowerPoint slides.

Workflow:

User uploads an Excel file via the frontend.

The file is sent to the FastAPI backend through an HTTP POST request.

Backend processes the Excel file, generates visualizations, and compiles them into PowerPoint.

Backend returns the generated PowerPoint file to the user for download.

4. Frontend Design

Technology: React + TailwindCSS

Features: File upload button, progress bar, download link

UI/UX: Minimalist and responsive design

5. Backend Design with FastAPI

Framework: FastAPI (Python 3.x)

Endpoints:

POST /upload → Receives Excel file

GET /download/{filename} → Returns generated PowerPoint

Advantages of FastAPI:

High performance (async support)

Auto-generated API documentation with OpenAPI/Swagger

Easy integration with Python libraries (pandas, matplotlib, python-pptx)


6. Data Processing Workflow

Read uploaded Excel file using pandas.

Extract relevant data and perform calculations.

Generate graphs using matplotlib.

Insert graphs into PowerPoint slides using python-pptx.

Return PowerPoint file to user.

7. PowerPoint Generation

Library Used: python-pptx

Contents: Title slide, charts, summary tables

Customization: Template support for consistent branding

8. Testing and Validation

Unit Tests: Excel file parsing, PowerPoint generation

Integration Tests: End-to-end file upload → processing → download

User Testing: Verified usability and correctness of reports

9. Security Considerations

Files stored temporarily and deleted after download

No login required; lightweight security suitable for local usage

HTTPS recommended if deployed online

10. Future Improvements

Add support for multiple file formats (CSV, JSON)

Provide customization for chart types

Enable cloud deployment for remote usage

Implement scheduling for automated reporting

11. Conclusion

This project demonstrates the design of a lightweight data processing website using React frontend and FastAPI backend. The system supports local Excel file uploads and automatically generates downloadable PowerPoint reports. By leveraging FastAPI, the solution ensures efficiency, scalability, and user-friendliness without the need for SQL databases or login systems. N