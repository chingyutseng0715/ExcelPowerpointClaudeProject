// src/components/Upload.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';

const Upload = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fileId, setFileId] = useState(null); // Backend file ID

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Reset states
    setUploadError(null);
    setUploadedFile(null);
    
    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload an Excel file (.xlsx, .xls)');
      return;
    }

    // Check file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for backend upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('originalName', file.name);

      // Upload to backend
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Store file info and backend file ID
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      });
      
      setFileId(result.fileId); // Backend returns unique file ID
      
      // Store in localStorage for persistence
      localStorage.setItem('currentProject', JSON.stringify({
        fileId: result.fileId,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        sheets: result.sheets || [] // Backend returns sheet names
      }));

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    if (uploadedFile && fileId) {
      navigate('/process'); // Navigate to data processing page
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const handleRemoveFile = async () => {
    if (fileId) {
      try {
        // Delete file from backend
        await fetch(`http://localhost:8000/api/upload/${fileId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    setUploadedFile(null);
    setFileId(null);
    setUploadError(null);
    localStorage.removeItem('currentProject');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button 
        onClick={handleBackHome}
        className="absolute top-6 left-6 border border-[#2a2a2a] py-2 px-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a]"
      >
        <i className='bx bx-arrow-back mr-2'></i>Back
      </button>

      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Upload Your Excel File</h1>
        
        {uploadError && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-center">
            <i className='bx bx-error text-red-500 text-xl mr-2'></i>
            {uploadError}
          </div>
        )}
        
        {!uploadedFile ? (
          <>
            {/* Drag and Drop Area */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-[#e99b63] bg-[#e99b63]/10' 
                  : 'border-[#2a2a2a] hover:border-[#e99b63]/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e99b63] mb-4"></div>
                  <p className="text-lg">Uploading and processing...</p>
                  <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className='bx bx-cloud-upload text-6xl text-[#e99b63] mb-4'></i>
                  <p className="text-xl mb-2">Drag and drop your Excel file here</p>
                  <p className="text-gray-400 mb-4">or</p>
                  <div className="border border-[#e99b63] py-3 px-6 rounded-full font-semibold tracking-wider transition-all duration-300 hover:bg-[#e99b63] hover:text-black">
                    Browse Files
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: .xlsx, .xls, .csv (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* File Uploaded Successfully */
          <div className="border border-[#2a2a2a] rounded-xl p-8 text-center">
            <i className='bx bx-check-circle text-6xl text-green-500 mb-4'></i>
            <h2 className="text-2xl font-semibold mb-4">File Processed Successfully!</h2>
            
            <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className='bx bx-file text-2xl text-[#e99b63] mr-3'></i>
                  <div className="text-left">
                    <p className="font-semibold">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <i className='bx bx-x text-xl'></i>
                </button>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleRemoveFile}
                className="border border-[#2a2a2a] py-3 px-6 rounded-full font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a]"
              >
                Upload Another
              </button>
              <button 
                onClick={handleContinue}
                className="border border-[#e99b63] py-3 px-8 rounded-full font-semibold tracking-wider transition-all duration-300 hover:bg-[#e99b63] hover:text-black bg-[#e99b63] text-black"
              >
                Process Data <i className='bx bx-arrow-right ml-2'></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;