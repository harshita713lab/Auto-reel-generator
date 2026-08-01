// src/components/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import logoImage from '../assets/logo/WhatsApp Image 2026-06-27 at 2.44.13 PM.jpeg';

function HeroSection() {
    // Text animation variants
    const titleText = "Fotographiya Reel Maker".split("");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.2 * i },
        }),
    };

    const letterVariants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

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
                {/* Logo Pulse Animation */}
                <motion.div 
                    className="logo-circle pulse-ring"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "backOut" }}
                >
                    <img 
                        src={logoImage}
                        alt="ReelForge Logo"
                    />
                </motion.div>

                {/* Animated Title (Letter by Letter) */}
                <motion.h1 
                    className="hero-title"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
                >
                    {titleText.map((letter, index) => (
                        <motion.span
                            key={index}
                            variants={letterVariants}
                            className={index < 12 ? "brand" : "sub-brand"}
                            style={{ display: "inline-block", whiteSpace: "pre" }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.h1>

                {/* Animated Description */}
                <motion.p 
                    className="hero-desc"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                >
                    Turn your memories into stunning social media reels with AI-powered magic.
                    Upload images and get a professional video in seconds.
                </motion.p>

                {/* Animated Stats */}
                <motion.div 
                    className="hero-stats"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.8 }}
                >
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
                </motion.div>
            </div>

            {/* Bouncing Arrow */}
            <motion.div 
                className="hero-arrow"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
                ↓
            </motion.div>
        </section>
    );
}

export default HeroSection;