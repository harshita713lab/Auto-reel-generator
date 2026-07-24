import React from 'react';
import { Link } from 'react-router-dom';
import ReelsGrid from '../components/ReelsGrid';

function AllReels() {
    return (
        <div className="all-reels-page">
            <div className="page-header">
                <h1>🎬 All Reels</h1>
                <Link to="/" className="back-home-btn">← Back to Home</Link>
            </div>
            <ReelsGrid />
        </div>
    );
}

export default AllReels;