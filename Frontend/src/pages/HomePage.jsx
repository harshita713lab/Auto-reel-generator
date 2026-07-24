import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import UploadSection from '../components/UploadSection';
import LatestReel from '../components/LatestReel';
import Sidebar from '../components/Sidebar';

function HomePage() {
    return (
        <div className="homepage">
            {/* Hero Section */}
            <HeroSection />

            {/* Latest Reel */}
            <LatestReel />

            <div className="main-content">
                {/* Upload Section */}
                <UploadSection />

                {/* Sidebar */}
                <Sidebar />
            </div>
        </div>
    );
}

export default HomePage;