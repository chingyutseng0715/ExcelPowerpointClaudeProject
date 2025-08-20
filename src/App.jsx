
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Body from "./components/Body";
import Process from "./components/Process";
import Upload from "./components/Upload";


const Home = () => {
  return (
    <>
      <img className="absolute top-0 right-0 opacity-60 -z-10" src="/gradient.png" alt="background" />
      <div className="h-0 w-[40rem] absolute top-[20%] right-[-5%] shadow-[0_0_900px_25px_#e99b63] -rotate-[30deg] -z-10"></div>
      
      <Header/>
      <Body/>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/process" element={<Process />} />
        </Routes>
      </main>
    </Router>
  );
}
