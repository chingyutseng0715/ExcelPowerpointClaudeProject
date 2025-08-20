# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KISARA** is a full-stack web application for converting Excel files to PowerPoint presentations. The system combines a React frontend with a FastAPI backend to enable users to upload Excel/CSV files, customize presentation slides with live preview functionality, and generate downloadable PowerPoint files. The application features a modern dark theme with orange accent colors (#e99b63) and sophisticated animation effects.

**Project Name**: ExcelProcess_HomePage
**Author**: Eugene Tseng (eugenetseng0715@gmail.com)
**GitHub**: https://github.com/chingyutseng0715
**LinkedIn**: https://www.linkedin.com/in/eugene-tseng-086561346/

## Development Commands

### Frontend (React + Vite)
```bash
# Start frontend development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend (FastAPI)
```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Start backend development server (port 8000)
python main.py
# OR
uvicorn main:app --host 0.0.0.0 --port 8000
```

## System Architecture

### Full-Stack Implementation
This is a complete full-stack application with:
- **Frontend**: React 19 + Vite served on `localhost:5173`
- **Backend**: FastAPI served on `localhost:8000`
- **CORS**: Configured for local development between frontend and backend

### Technology Stack

#### Frontend
- **React 19** with functional components and hooks
- **React Router DOM 7.7** for client-side routing
- **Vite 7** for development and build tooling
- **Tailwind CSS 3.4** for styling with custom animations
- **Boxicons 2.1** for icon library

#### Backend
- **FastAPI 0.104** for REST API endpoints
- **Uvicorn 0.24** as ASGI server
- **pandas 2+** for Excel/CSV data processing
- **python-pptx 0.6** for PowerPoint generation
- **Pillow 9+** for image processing and preview generation
- **openpyxl 3.1** for Excel file handling

### Application Flow
1. **Home (/)** - Landing page with animated introduction and navigation
2. **Upload (/upload)** - Drag-and-drop file upload with backend processing
3. **Process (/process)** - PowerPoint customization with live preview and download

### Component Architecture

#### Frontend Structure
```
src/
├── App.jsx           # Main router with three routes
├── main.jsx          # React app entry point
├── index.css         # Global styles and Tailwind imports
└── components/
    ├── Header.jsx    # Navigation with mobile menu and instructions modal
    ├── Body.jsx      # Landing page with animated CTAs
    ├── Upload.jsx    # File upload with validation and backend integration
    └── Process.jsx   # PowerPoint customization interface
```

#### Backend Structure
```
backend/
├── main.py           # FastAPI application with all endpoints
├── requirements.txt  # Python dependencies
├── uploads/          # Temporary file storage
├── previews/         # Generated PowerPoint files
├── images/           # Preview images
└── FirstPage.png     # PowerPoint template background
```

### State Management
- **Local State**: `useState` hooks for component-specific data
- **Persistence**: `localStorage` for data persistence between routes
- **File Management**: Backend file storage with unique file IDs

**localStorage Schema:**
```javascript
{
  fileId: "uuid-generated-id",
  fileName: "original-filename.xlsx",
  fileSize: 1024576,
  uploadedAt: "2025-01-01T00:00:00.000Z",
  sheets: ["Sheet1", "Sheet2"],
  firstPageCustomization: {
    presentationTo: "Client Name",
    madeBy: "Your Name"
  }
}
```

### API Integration (Fully Implemented)

#### Backend Endpoints
- `POST /api/upload` - Upload Excel/CSV files with session tracking, returns fileId and sheet names
- `GET /api/files/{fileId}/data` - Retrieve processed Excel data as JSON
- `DELETE /api/upload/{fileId}` - Delete specific uploaded file
- `DELETE /api/clear-all` - Clear all files from uploads, previews, and images directories
- `POST /api/generate-preview` - Generate PowerPoint with custom filename based on presentation name
- `GET /api/download-preview/{filename}` - Download generated PowerPoint with custom filename
- `GET /api/preview-image/{filename}` - Get PowerPoint preview image
- `POST /api/register-session` - Register new user session for automatic cleanup tracking
- `POST /api/cleanup-session` - Cleanup all files when user leaves the site
- `GET /api/files` - Get information about all uploaded files
- `GET /api/health` - Health check endpoint

#### File Processing Features
- Supports `.xlsx`, `.xls`, and `.csv` files (max 10MB)
- Unique file ID generation for file tracking
- Session-based file tracking for automatic cleanup
- Temporary file storage with automatic cleanup on browser close
- Sheet name extraction and data parsing
- Error handling for corrupted or invalid files
- Custom PowerPoint filenames based on "Presentation to" field

### PowerPoint Generation

#### Template System
- Uses `FirstPage.png` as background template
- Customizable text fields: "Presentation to" and "Made by"
- Live preview generation with PIL (Python Imaging Library)
- Positioning matches actual PowerPoint layout

#### Custom Filename System
- PowerPoint files named using "Presentation to" field content
- Automatic filename sanitization for cross-platform compatibility
- Unique server-side IDs prevent file conflicts
- Clean download filenames without internal IDs

#### Preview System
- Real-time preview image generation
- Matches actual PowerPoint positioning and styling
- PNG preview images for web display
- Downloadable PPTX files with identical formatting

### Styling & Design

#### Color Scheme
- **Background**: Black (`bg-black`)
- **Primary Accent**: Orange `#e99b63`
- **Secondary Colors**: `#1a1a1a`, `#2a2a2a`, `#a7a7a7`
- **Border Radius**: `rounded-full` for buttons, `rounded-lg` for panels

#### Animation System
- Custom CSS keyframe animations (fallDown, slideInLeft, splashPop)
- Staggered animation delays for sequential reveals
- Hover transitions with `transition-all duration-300`
- Loading spinners and progress indicators

### Navigation & UX
- React Router programmatic navigation with `useNavigate()`
- Route protection (Process page requires uploaded file)
- Mobile-responsive design with hamburger menu
- Drag-and-drop file upload interface
- Real-time file validation and error handling

### Security & File Handling
- File type validation on frontend and backend
- File size limits (10MB max)
- Session-based file tracking with automatic cleanup
- Automatic file deletion on browser close/navigation
- Multiple cleanup triggers (beforeunload, visibilitychange, etc.)
- CORS configuration for local development
- No persistent storage or user authentication required
- Privacy protection through automatic file removal

## Key Files

### Frontend Components
- `src/App.jsx:26` - Main router with session management initialization
- `src/components/Header.jsx:28` - Animated header with KISARA branding
- `src/components/Body.jsx:27` - Landing page with multi-file support messaging
- `src/components/Upload.jsx:7` - Multi-file upload interface with session tracking
- `src/components/Process.jsx:6` - PowerPoint customization with file selection and cleanup
- `src/utils/sessionManager.js:1` - Session management and automatic cleanup system

### Backend Implementation
- `backend/main.py:19` - FastAPI application with CORS middleware
- `backend/main.py:42` - Filename sanitization function for safe file naming
- `backend/main.py:69` - File upload endpoint with session tracking
- `backend/main.py:127` - Excel data extraction endpoint
- `backend/main.py:358` - PowerPoint generation with custom filenames
- `backend/main.py:545` - Session registration for automatic cleanup
- `backend/main.py:562` - Session cleanup endpoint for privacy protection

### Configuration
- `package.json:12` - Frontend dependencies and scripts
- `backend/requirements.txt:1` - Python backend dependencies
- `vite.config.js:5` - Vite configuration for React
- `tailwind.config.js` - Tailwind CSS customization

## Development Guidelines

### File Structure Rules
- Edit existing files rather than creating new ones
- Only create files when absolutely necessary for functionality
- Maintain consistent code style across frontend and backend

### API Development
- Backend runs on port 8000, frontend on port 5173
- All API endpoints use `/api/` prefix
- Implement proper error handling and validation
- Use unique file IDs for file management

### Frontend Development
- Follow React functional component patterns
- Use Tailwind classes consistently with existing design
- Implement responsive design for mobile compatibility
- Maintain animation timing and visual consistency

### Backend Development
- Use FastAPI async patterns where appropriate
- Implement proper file cleanup and storage management
- Maintain CORS configuration for development
- Follow RESTful API design principles

## Recent Features

### Multi-File Upload Support
- Upload multiple Excel files in a single session
- Individual file management with remove functionality
- File selection for PowerPoint generation
- Maintains backward compatibility with single-file projects

### Custom PowerPoint Filenames
- Uses "Presentation to" field as download filename
- Automatic filename sanitization for safety
- Example: "My Company Meeting" → "My_Company_Meeting.pptx"
- Prevents file conflicts with unique server-side IDs

### Automatic Privacy Protection
- Session-based file tracking system
- Automatic cleanup on browser close/navigation
- Multiple cleanup triggers for reliability
- Files deleted from uploads/, previews/, and images/ directories
- No user intervention required for cleanup

### Enhanced Restart Functionality
- Complete system reset with file cleanup
- User confirmation dialog with detailed warnings
- Session-based cleanup with fallback options
- Returns to home page after cleanup completion