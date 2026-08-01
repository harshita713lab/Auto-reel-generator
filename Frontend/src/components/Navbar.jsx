// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // ✅ Theme State add kiya
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // ✅ Theme change karne ka function
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        // Page load hone par theme apply ho
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

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

                    {/* ✅ Settings Link */}
                    <Link to="/settings" className="nav-link settings-link">
                        <FontAwesomeIcon icon={faGear} />
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