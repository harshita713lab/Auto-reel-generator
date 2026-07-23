// src/components/HeroSection.jsx
import React from 'react';
// ✅ Sahi path - assets/logo folder se image import
import logoImage from '../assets/logo/WhatsApp Image 2026-06-27 at 2.44.13 PM.jpeg';

function HeroSection() {
    return (
        <section className="hero-section">
            <div className="hero-background"></div>
            
            <div className="hero-particles">
                <div className="particle p1"></div>
                <div className="particle p2"></div>
                <div className="particle p3"></div>
                <div className="particle p4"></div>
                <div className="particle p5"></div>
            </div>

            <div className="floating-elements">
                <span className="float-icon float-1">📸</span>
                <span className="float-icon float-2">🎬</span>
                <span className="float-icon float-3">🎵</span>
                <span className="float-icon float-4">✨</span>
            </div>

            <div className="hero-content">
                <div className="logo-circle pulse-ring">
                    <img 
                        src={logoImage}
                        alt="ReelForge Logo"
                    />
                </div>

                <h1 className="hero-title">
                    <span className="brand">Fotographiya </span>
                    <span className="sub-brand">Reel Maker</span>
                </h1>

                <p className="hero-desc">
                    Turn your memories into stunning social media reels with AI-powered magic.
                    Upload images and get a professional video in seconds.
                </p>

                <div className="hero-stats">
                    <div className="stat">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Reels Created</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">4.9</span>
                        <span className="stat-label">User Rating</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">10s</span>
                        <span className="stat-label">Avg. Creation</span>
                    </div>
                </div>
            </div>

            <div className="hero-arrow">↓</div>
        </section>
    );
}

export default HeroSection;