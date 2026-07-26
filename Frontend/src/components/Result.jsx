// frontend/src/components/Result.jsx
import React, { useState } from 'react';

function Result({ reelData, onReset }) {
    const [rating, setRating] = useState(0);

    const videoUrl = reelData?.downloadUrl 
        ? `http://localhost:5000${reelData.downloadUrl}` 
        : '';

    // ✅ Download function - blob fetch karke download karega
    const handleDownload = async () => {
        if (!videoUrl) return;
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reel_${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed! Please try again.');
        }
    };

    return (
        <div className="result-section">
            <div className="result-success">
                <span className="success-icon">✅</span>
                <h2>Your Reel is Ready!</h2>
            </div>
            
            <div className="video-wrapper">
                {videoUrl ? (
                    <video 
                        controls 
                        muted 
                        style={{ width: '100%', maxHeight: '500px', borderRadius: '12px' }}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="video-placeholder">
                        <span className="play-icon">▶️</span>
                        <p>Reel Preview</p>
                        <small>{reelData?.music || 'Music'} • {reelData?.template || 'Template'}</small>
                    </div>
                )}
            </div>

            <div className="reel-details">
                <div className="detail-item">
                    <span className="detail-icon">🎵</span>
                    <span>{reelData?.music || 'Upbeat'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">🎬</span>
                    <span>{reelData?.template || 'Fade'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="rating-section">
                <p>Rate your Reel</p>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span 
                            key={star} 
                            className={`star ${star <= rating ? 'active' : ''}`} 
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            <div className="actions">
                {videoUrl && (
                    <button 
                        onClick={handleDownload}
                        className="download-btn"
                    >
                        📥 Download Reel
                    </button>
                )}
                <button className="reset-btn" onClick={onReset}>
                    🔄 Create Another
                </button>
            </div>
        </div>
    );
}

export default Result;