// src/components/Upload.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';

const Upload = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Changed to array for multiple files
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Load existing files on component mount
  useEffect(() => {
    const existingProject = JSON.parse(localStorage.getItem('currentProject') || '{}');
    if (existingProject.files && Array.isArray(existingProject.files)) {
      setUploadedFiles(existingProject.files);
    }
  }, []);

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
    // Reset error state
    setUploadError(null);
    
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
      
      // Create new file object
      const newFile = {
        fileId: result.fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        sheets: result.sheets || []
      };
      
      // Add to uploaded files array
      setUploadedFiles(prev => [...prev, newFile]);
      
      // Update localStorage with all files
      const existingProject = JSON.parse(localStorage.getItem('currentProject') || '{}');
      const updatedProject = {
        ...existingProject,
        files: [...(existingProject.files || []), newFile],
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('currentProject', JSON.stringify(updatedProject));

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    if (uploadedFiles.length > 0) {
      navigate('/process'); // Navigate to data processing page
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const handleRemoveFile = async (fileToRemove) => {
    try {
      // Delete file from backend
      const response = await fetch(`http://localhost:8000/api/upload/${fileToRemove.fileId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Backend deletion failed: ${response.status} - ${errorText}`);
        // Continue with frontend cleanup anyway
      } else {
        console.log('File successfully deleted from backend');
      }
    } catch (error) {
      console.error('Error deleting file from backend:', error);
      // Continue with frontend cleanup anyway
    }
    
    // Remove from uploaded files array
    const updatedFiles = uploadedFiles.filter(file => file.fileId !== fileToRemove.fileId);
    setUploadedFiles(updatedFiles);
    
    // Update localStorage
    if (updatedFiles.length === 0) {
      localStorage.removeItem('currentProject');
    } else {
      const existingProject = JSON.parse(localStorage.getItem('currentProject') || '{}');
      const updatedProject = {
        ...existingProject,
        files: updatedFiles,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('currentProject', JSON.stringify(updatedProject));
    }
    
    setUploadError(null);
  };

  const handleUploadAnother = () => {
    // Reset upload state and trigger file input
    setUploadError(null);
    // Trigger the hidden file input by creating and clicking a temporary input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls,.csv';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
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
        <h1 className="text-4xl font-bold text-center mb-8">
          {uploadedFiles.length === 0 ? 'Upload Your Excel Files' : `Uploaded Files (${uploadedFiles.length})`}
        </h1>
        
        {uploadError && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-center">
            <i className='bx bx-error text-red-500 text-xl mr-2'></i>
            {uploadError}
          </div>
        )}
        
        {/* Upload Area - Always visible for adding more files */}
        <div className="mb-6">
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
                  <p className="text-xl mb-2">{uploadedFiles.length === 0 ? 'Drag and drop your Excel files here' : 'Add more Excel files'}</p>
                  <p className="text-gray-400 mb-4">or</p>
                  <div className="border border-[#e99b63] py-3 px-6 rounded-full font-semibold tracking-wider transition-all duration-300 hover:bg-[#e99b63] hover:text-black">
                    {uploadedFiles.length === 0 ? 'Browse Files' : 'Browse More Files'}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: .xlsx, .xls, .csv (Max 10MB)
                  </p>
                </div>
              )}
            </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-green-500">
              <i className='bx bx-check-circle mr-2'></i>
              Files Processed Successfully!
            </h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div key={file.fileId} className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <i className='bx bx-file text-2xl text-[#e99b63] mr-3'></i>
                      <div className="text-left flex-1">
                        <p className="font-semibold truncate">{file.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{file.sheets.length} sheet{file.sheets.length !== 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span>#{index + 1}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFile(file)}
                      className="text-red-500 hover:text-red-400 transition-colors ml-4"
                      title="Remove file"
                    >
                      <i className='bx bx-x text-xl'></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button 
                onClick={handleUploadAnother}
                className="border border-[#2a2a2a] py-3 px-6 rounded-full font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a]"
              >
                <i className='bx bx-plus mr-2'></i>Add More Files
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