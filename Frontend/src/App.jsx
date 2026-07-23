import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // ✅ Import
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AllReels from './pages/AllReels';
import './styles/style.css';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import CSS

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/all-reels" element={<AllReels />} />
                </Routes>
                {/* ✅ Add ToastContainer - Yeh ek baar add karo */}
                <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        </BrowserRouter>
    );
}

export default App;