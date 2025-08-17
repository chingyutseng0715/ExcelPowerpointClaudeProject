import React, { useState } from 'react'
import 'boxicons/css/boxicons.min.css';

const Header = () => {
    const [showInstructions, setShowInstructions] = useState(false);

    const toggleMobileMenu = () => {
        const mobileMenu = document.getElementById('mobileMenu')

        if(mobileMenu.classList.contains('hidden')){
            mobileMenu.classList.remove('hidden');
        }else{
            mobileMenu.classList.add('hidden');
        }
    }

    const handleInstructionsClick = (e) => {
        e.preventDefault();
        setShowInstructions(true);
    };

    const closeInstructions = () => {
        setShowInstructions(false);
    };

  return (
    <header className='flex justify-between items-center py-4 px-4 lg:px-20'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-light m-0 animate-[fallDown_0.8s_ease-out_forwards] transform translate-y-[-100px] opacity-0' style={{animationDelay: '0s'}}>
            KISARA
        </h1>

        <nav className='hidden md:flex items-center gap-12'>
            <a className='text-base tracking-wider transition-colors hover:text-gray-300 z-50 animate-[fallDown_0.8s_ease-out_forwards] transform translate-y-[-100px] opacity-0' style={{animationDelay: '0.15s'}} href="https://github.com/chingyutseng0715">
                AUTHOR
            </a>

            <a className='text-base tracking-wider transition-colors hover:text-gray-300 z-50 animate-[fallDown_0.8s_ease-out_forwards] transform translate-y-[-100px] opacity-0' style={{animationDelay: '0.3s'}} onClick={handleInstructionsClick} href="#">
                INSTRUCTIONS
            </a>

            <a className='text-base tracking-wider transition-colors hover:text-gray-300 z-50 animate-[fallDown_0.8s_ease-out_forwards] transform translate-y-[-100px] opacity-0' style={{animationDelay: '0.45s'}} href="mailto:eugenetseng0715@gmail.com">
                CONTACT ME
            </a>

            <a className='text-base tracking-wider transition-colors hover:text-gray-300 z-50 animate-[fallDown_0.8s_ease-out_forwards] transform translate-y-[-100px] opacity-0' style={{animationDelay: '0.6s'}} href="https://www.linkedin.com/in/eugene-tseng-086561346/">
                ABOUT ME
            </a>
        </nav>

        <div className='hidden md:block relative'>
            <button className='bg-[#a7a7a7] text-black py-3 px-8 rounded-full border-none font-medium transtiion-all duration-500 hover:bg-white cursor-pointer z-50 animate-[splashPop_0.8s_ease-out_forwards] transform scale-0 opacity-0' style={{animationDelay: '0.75s'}}>
                FORMAT DOWNLOAD
            </button>
            {/* Water splash particles */}
            <div className='absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full animate-[splash1_0.8s_ease-out_forwards] transform scale-0 opacity-0' style={{animationDelay: '1.1s'}}></div>
            <div className='absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full animate-[splash2_0.7s_ease-out_forwards] transform scale-0 opacity-0' style={{animationDelay: '1.15s'}}></div>
            <div className='absolute top-1/2 left-1/2 w-5 h-5 bg-white rounded-full animate-[splash3_0.9s_ease-out_forwards] transform scale-0 opacity-0' style={{animationDelay: '1.2s'}}></div>
            <div className='absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full animate-[splash4_0.8s_ease-out_forwards] transform scale-0 opacity-0' style={{animationDelay: '1.25s'}}></div>
        </div>
        
        {/*Mobile Menu */}
        <button className='md:hidden text-3xl p-2 z-50' onClick={toggleMobileMenu}>
            <i class='bx  bx-dots-vertical-rounded'  ></i> 
        </button>

        <div id='mobileMenu'className='hidden fixed top-16 bottom-0 right-0 left-0 p-5 md:hidden z-40 bg-opacity-70 backdrop-blur-md'>
            <nav className='flex flex-col gap-6 items-center'>
                <a className='text-base tracking-wider transition-colors hover:text-gray-300 z-50' href="https://github.com/chingyutseng0715">
                    AUTHOR
                </a>

                <a className='text-base tracking-wider transition-colors hover:text-gray-300 z-50'  onClick={handleInstructionsClick} href="#">
                    INSTRUCTIONS
                </a>

                <a className='text-base tracking-wider transition-colors hover:text-gray-300 z-50' href="mailto:eugenetseng0715@gmail.com">
                    CONTACT ME
                </a>

                <a className='text-base tracking-wider transition-colors hover:text-gray-300 z-50' href="https://www.linkedin.com/in/eugene-tseng-086561346/">
                    ABOUT ME
                </a>
            </nav>
        </div>

        {/* INSTRUCTIONS Popup */}
        {showInstructions && (
            <div className='fixed inset-0 bg-black bg-opacity-90 text-white z-50 flex flex-col items-center justify-center px-8 text-center'>
                <button 
                    onClick={closeInstructions} 
                    className='absolute top-6 right-6 text-white text-3xl hover:text-gray-400'
                    aria-label="Close instructions"
                >
                    &times;
                </button>
                <div className='max-w-2xl'>
                    <h2 className='text-2xl font-semibold mb-4'>How to Use</h2>
                    <p className='text-lg text-left'>
                        1. Download the formal format from the homepage and fill up required fields. <br />
                        2. Sign in from the top right button to unlock the functionalities <br />
                        3. After signed in, the GetStarted button should be enabled. <br />
                        4. Click on the GetStarted button to proceed to next step
                    </p>
                </div>
            </div>
        )}



    </header>


  )
}

export default Header
