import React from 'react'
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';

const Body = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Check if user has uploaded a file
    const project = JSON.parse(localStorage.getItem('currentProject') || '{}');
    
    if (!project.fileId) {
      // No file uploaded, redirect to upload page
      alert('Please upload an Excel file first before proceeding.');
      navigate('/upload');
      return;
    }
    
    // File exists, proceed to process page
    navigate('/process');
  };

  const handleUploadFile = () => {
    navigate('/upload');
  };

  return (
    <main className='flex lg:mt-20 flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)]'>
      <div className='max-w-xl ml-[5%] z-10 mt-[90%] md:mt-[60%] lg:mt-0 animate-[slideInLeft_1s_ease-out_forwards] transform translate-x-[-100px] opacity-0'>
        <div className='relative w-[95%] sm:w-48 h-10 bg-gradient-to-r from-[#656565] to-[#e99b63] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full'>
          <div className='absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1'>
            INTRODUCING
          </div>
        </div>

        <h1 className='text-3xl msm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8'>
          EXCEL DATA
          <br />
          PPT CONVERTER
        </h1>

        <p className='text-base sm:text-lg tradcking-wider text-gray-400 max-w-[25rem] lg:max-w-[30rem]'>
          Download the indicated format below to enjoy the full functionality of the application.
        </p>

        <div className='flex gap-4 mt-12'>
          <a onClick={handleUploadFile} className='border border-[#2a2a2a] py-2 sm:py-3 px-4 sm:px-5 rounded-full sm:text-lg tesm-sm font-semibold tracking-wider transtition-all duration-300 hover:bg-[#1a1a1a]' href="#">
            UPLOAD FILE <i className='bx bx-extension'></i>
          </a>
          
          <button 
            onClick={handleGetStarted}
            className='border border-[#2a2a2a] py-2 sm:py-3 px-4 sm:px-10 rounded-full sm:text-lg tesm-sm font-semibold tracking-wider transtition-all duration-300 hover:bg-[#1a1a1a] bg-gray-300 text-black hover:text-white'
          >
            GetStarted <i className='bx bx-extension'></i>
          </button>
        </div>
      </div>
    </main>
  )
}

export default Body;