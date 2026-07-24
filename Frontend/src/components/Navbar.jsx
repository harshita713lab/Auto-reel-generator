import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🎬</span>
                    <span className="logo-text">Fotographiya Reel Maker</span>
                </Link>

                {/* Nav Links */}
                <div className="nav-links">
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/all-reels" 
                        className={`nav-link ${location.pathname === '/all-reels' ? 'active' : ''}`}
                    >
                        All Reels
                    </Link>
                    <Link to="/" className="nav-link create-link">
                        Create Reel
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;