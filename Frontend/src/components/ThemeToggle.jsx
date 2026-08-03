// src/components/ThemeToggle.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ThemeToggle = ({ theme, onToggle }) => {
    return (
        <div className="theme-toggle-wrapper">
            <div className="toggle-label">
                <span className={theme === 'dark' ? 'active' : ''}>
                    <FontAwesomeIcon icon={faMoon} />
                </span>
                
                <label className="toggle-switch">
                    <input 
                        type="checkbox" 
                        checked={theme === 'light'} 
                        onChange={onToggle} 
                    />
                    <span className="slider round"></span>
                </label>

                <span className={theme === 'light' ? 'active' : ''}>
                    <FontAwesomeIcon icon={faSun} />
                </span>
            </div>
        </div>
    );
};

export default ThemeToggle;