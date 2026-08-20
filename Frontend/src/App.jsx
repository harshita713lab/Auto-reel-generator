import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AllReels from './pages/AllReels';
import Settings from './pages/Settings';
import Trash from './pages/Trash';
import DownloadHistory from './pages/DownloadHistory';
import './styles/style.css';

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* ✅ Cursor Glow */}
      <div 
        className="cursor-glow" 
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all-reels" element={<AllReels />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/downloads" element={<DownloadHistory />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;