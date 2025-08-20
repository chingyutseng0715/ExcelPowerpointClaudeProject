import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';

const Process = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // First page customization state
  const [presentationTo, setPresentationTo] = useState('');
  const [madeBy, setMadeBy] = useState('');
  const [previewTo, setPreviewTo] = useState('Presentation to');
  const [previewMadeBy, setPreviewMadeBy] = useState('Made by');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0); // For selecting which file to use for preview

  useEffect(() => {
    // Immediate check before component fully loads
    const hasFile = localStorage.getItem('currentProject');
    if (!hasFile) {
      navigate('/upload');
      return;
    }
    
    checkUploadedFile();
  }, []);

  const checkUploadedFile = () => {
    try {
      // Check if user has uploaded files
      const project = JSON.parse(localStorage.getItem('currentProject') || '{}');
      
      // Check for new multi-file structure
      if (project.files && Array.isArray(project.files) && project.files.length > 0) {
        // New multi-file structure
        setProjectData(project);
      } else if (project.fileId && project.fileName) {
        // Legacy single file structure - convert to new format
        const convertedProject = {
          files: [{
            fileId: project.fileId,
            name: project.fileName,
            size: project.fileSize,
            uploadedAt: project.uploadedAt,
            sheets: project.sheets || []
          }],
          firstPageCustomization: project.firstPageCustomization,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('currentProject', JSON.stringify(convertedProject));
        setProjectData(convertedProject);
      } else {
        // No files uploaded
        alert('Please upload Excel files first before accessing this page.');
        navigate('/upload');
        return;
      }

      setProjectData(project);
      
      // Load existing customizations if they exist
      if (project.firstPageCustomization) {
        setPresentationTo(project.firstPageCustomization.presentationTo || '');
        setMadeBy(project.firstPageCustomization.madeBy || '');
        setPreviewTo(project.firstPageCustomization.presentationTo || 'Presentation to');
        setPreviewMadeBy(project.firstPageCustomization.madeBy || 'Made by');
      }
      
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading project:', error);
      alert('Error loading project data. Please upload a file again.');
      localStorage.removeItem('currentProject'); // Clear corrupted data
      navigate('/upload');
    }
  };

  const handleBack = () => {
    navigate('/upload');
  };

  const handleNext = () => {
    // Placeholder for next page - will be implemented later
    alert('Next page functionality will be implemented in future updates.');
  };

  const handleRestart = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to restart? This will:\n\n' +
      '• Delete all uploaded files\n' +
      '• Clear all generated previews and images\n' +
      '• Reset all customizations\n' +
      '• Return to the home page\n\n' +
      'This action cannot be undone.'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      console.log('Starting complete restart - clearing all files...');
      
      // Clear all files using the backend endpoint
      const response = await fetch('http://localhost:8000/api/clear-all', {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Clear-all request failed:', response.status, errorText);
        alert('Warning: Backend cleanup may have failed, but continuing with restart...');
      } else {
        const result = await response.json();
        console.log('Cleanup completed:', result);
      }
      
      // Clear localStorage
      localStorage.removeItem('currentProject');
      console.log('Cleared localStorage');
      
      // Show success message briefly before navigating
      alert('Restart completed! All files cleared and returning to home page.');
      
      // Navigate to home page
      navigate('/');
      
    } catch (error) {
      console.error('Error during restart:', error);
      
      // Show error but still proceed with cleanup and navigation
      alert('Warning: Some errors occurred during restart, but continuing...');
      
      // Still clear localStorage and navigate even if backend clear fails
      localStorage.removeItem('currentProject');
      navigate('/');
    }
  };

  const generateLivePreview = async (customPresentationTo = null, customMadeBy = null) => {
    if (!projectData?.files || projectData.files.length === 0) return;
    
    // Use the selected file for preview generation
    const selectedFile = projectData.files[selectedFileIndex] || projectData.files[0];
    
    setIsGeneratingPreview(true);
    try {
      // Generate PowerPoint only (for download)
      const response = await fetch('http://localhost:8000/api/generate-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: selectedFile.fileId,
          customizations: {
            presentationTo: customPresentationTo || presentationTo || 'Presentation to',
            madeBy: customMadeBy || madeBy || 'Made by'
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }
      
      const result = await response.json();
      const downloadUrl = `http://localhost:8000${result.downloadUrl}`;
      setPreviewUrl(downloadUrl);
      // Don't set previewImageUrl - we'll use frontend overlay instead
      
    } catch (error) {
      console.error('Error generating live preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleConfirm = async () => {
    // Update preview with user input
    const newPresentationTo = presentationTo || 'Presentation to';
    const newMadeBy = madeBy || 'Made by';
    
    setPreviewTo(newPresentationTo);
    setPreviewMadeBy(newMadeBy);
    
    // Save customizations to localStorage for persistence
    const updatedProject = {
      ...projectData,
      firstPageCustomization: {
        presentationTo: newPresentationTo,
        madeBy: newMadeBy
      }
    };
    localStorage.setItem('currentProject', JSON.stringify(updatedProject));
    setProjectData(updatedProject);
    
    // Generate live PowerPoint preview
    await generateLivePreview(newPresentationTo, newMadeBy);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e99b63] mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Back and Next buttons */}
      <div className="flex justify-between items-center p-6 border-b border-[#2a2a2a]">
        <button 
          onClick={handleBack}
          className="border border-[#2a2a2a] py-2 px-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a]"
        >
          <i className='bx bx-arrow-back mr-2'></i>Back
        </button>
        
        {previewUrl ? (
          <a 
            href={previewUrl}
            download
            className="bg-[#e99b63] hover:bg-[#d4925a] text-black py-2 px-6 rounded-full font-semibold tracking-wider transition-all duration-300 inline-flex items-center"
          >
            <i className='bx bx-download mr-2'></i> Download PowerPoint
          </a>
        ) : (
          <h1 className="text-xl font-semibold">Customize First Page</h1>
        )}
        
        <button 
          onClick={handleNext}
          className="border border-[#2a2a2a] py-2 px-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a]"
        >
          Next <i className='bx bx-arrow-right ml-2'></i>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-black to-gray-900">
        {/* Left Side - Preview */}
        <div className="w-1/2 p-8">
          <h2 className="text-xl font-semibold mb-6 text-white">Page 1</h2>
          
          {/* Preview Container */}
          <div className="relative w-full h-[500px] bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            {isGeneratingPreview ? (
              /* Loading State */
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e99b63] mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating PowerPoint...</p>
                </div>
              </div>
            ) : (
              /* Preview with FirstPage.png and updated text overlay */
              <>
                <img 
                  src="/FirstPage.png" 
                  alt="First Page Background" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Text - Positioned based on the actual FirstPage.png layout */}
                <div className="absolute inset-0 text-black">
                  {/* Presentation To Text Box - In right white area at 80% from left */}
                  <div className="absolute top-[45%] left-[80%] transform -translate-x-1/2 w-72">
                    <div className="border-2 border-gray-400 border-dashed rounded-lg p-3 bg-white/80 backdrop-blur-sm">
                      <p className="text-sm text-gray-600 text-left">
                        {previewTo === 'Presentation to' ? 'Presentation to (Ex: Taoglas internal, XXX company...etc)' : previewTo}
                      </p>
                    </div>
                  </div>
                  
                  {/* Made By Text Box - Bottom right area */}
                  <div className="absolute bottom-[15%] right-[8%]">
                    <div className="border-2 border-gray-400 border-dashed rounded-lg p-2 bg-white/80 backdrop-blur-sm">
                      <p className="text-sm text-gray-600 text-right">
                        {previewMadeBy === 'Made by' ? 'Made by:' : previewMadeBy}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Live Preview indicator - show when PowerPoint is ready */}
                {previewUrl && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Live Preview
                  </div>
                )}
                
                {/* Overlay message to generate preview - only show if no PowerPoint generated yet */}
                {!previewUrl && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                    <p className="text-sm">👆 Click "Confirm" to generate PowerPoint</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="flex items-center justify-center">
          <div className="w-0.5 h-[70vh] bg-gradient-to-b from-transparent via-gray-400 to-transparent opacity-50"></div>
        </div>

        {/* Right Side - Customization */}
        <div className="w-1/2 p-8">
          <h2 className="text-xl font-semibold mb-6 text-white">Customize Text</h2>
          
          <div className="space-y-8">
            {/* Presentation To Input */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-200">
                Presentation To
              </label>
              <textarea
                value={presentationTo}
                onChange={(e) => setPresentationTo(e.target.value)}
                placeholder="Enter presentation recipient..."
                className="w-full h-28 bg-gray-800/50 border border-gray-600 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:border-[#e99b63] focus:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-[#e99b63]/30 resize-none transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Made By Input */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-200">
                Made By
              </label>
              <textarea
                value={madeBy}
                onChange={(e) => setMadeBy(e.target.value)}
                placeholder="Enter author name..."
                className="w-full h-28 bg-gray-800/50 border border-gray-600 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:border-[#e99b63] focus:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-[#e99b63]/30 resize-none transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Files Info */}
            <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-xl p-6 border border-gray-600/50 backdrop-blur-sm">
              <p className="text-sm text-gray-300 mb-3 font-medium">
                Uploaded Files ({projectData?.files?.length || 0}):
              </p>
              
              {projectData?.files && projectData.files.length > 0 ? (
                <div className="space-y-3 max-h-32 overflow-y-auto">
                  {projectData.files.map((file, index) => (
                    <div 
                      key={file.fileId} 
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedFileIndex === index 
                          ? 'border-[#e99b63] bg-[#e99b63]/10' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedFileIndex(index)}
                    >
                      <p className="text-white font-semibold text-sm truncate">
                        {index + 1}. {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <span>{file.sheets?.length || 0} sheet{(file.sheets?.length || 0) !== 1 ? 's' : ''}</span>
                        {selectedFileIndex === index && (
                          <>
                            <span>•</span>
                            <span className="text-[#e99b63]">Active for preview</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No files loaded</p>
              )}
              
              {projectData?.lastUpdated && (
                <p className="text-xs text-gray-500 mt-3">
                  Last updated: {new Date(projectData.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-12 flex justify-between items-center">
            {/* Restart Button - Bottom Left */}
            <button 
              onClick={handleRestart}
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full font-semibold tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 transform hover:scale-105"
            >
              <i className='bx bx-refresh mr-2 text-lg'></i> Restart
            </button>
            
            {/* Confirm Button - Bottom Right */}
            <button 
              onClick={handleConfirm}
              className="bg-gradient-to-r from-[#e99b63] to-[#d4925a] text-black py-4 px-10 rounded-full font-bold tracking-wider transition-all duration-300 hover:from-[#d4925a] hover:to-[#c08852] hover:shadow-lg hover:shadow-[#e99b63]/30 transform hover:scale-105"
            >
              Confirm <i className='bx bx-check ml-2 text-lg'></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Process;