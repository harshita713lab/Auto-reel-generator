import React from 'react';

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-card tips">
                <h3>💡 Pro Tips</h3>
                <ul>
                    <li>📸 Use 3-10 high-quality images</li>
                    <li>🎨 Choose images with similar lighting</li>
                    <li>❤️ Pick your best moments</li>
                    <li>🎵 We'll add the perfect music</li>
                </ul>
            </div>
            <div className="sidebar-card preview-info">
                <h3>✨ What You Get</h3>
                <div className="feature-list">
                    <div className="feature-item">
                        <span className="feature-icon">🎬</span>
                        <span className="feature-text">Professional Reel</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎵</span>
                        <span className="feature-text">Auto-matched Music</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎨</span>
                        <span className="feature-text">Smart Transitions</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📱</span>
                        <span className="feature-text">Vertical Format (9:16)</span>
                    </div>
                </div>
            </div>
            <div className="sidebar-card rating-preview">
                <h3>⭐ Rate Your Experience</h3>
                <div className="rating-stars">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p>Share your feedback to help us improve</p>
            </div>
        </div>
    );
}

export default Sidebar;