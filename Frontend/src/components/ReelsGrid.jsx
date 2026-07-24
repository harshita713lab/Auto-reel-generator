// frontend/src/components/ReelsGrid.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // ✅ Import
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/api';

function ReelsGrid() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllReels();
    }, []);

    const fetchAllReels = async () => {
        try {
            const response = await fetch(`${API_URL}/reel/all`);
            if (response.ok) {
                const data = await response.json();
                setReels(data.reels);
            }
        } catch (error) {
            console.error('Error fetching reels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (videoUrl, filename) => {
        try {
            const fullUrl = `http://localhost:3000${videoUrl}`;
            const response = await fetch(fullUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `reel_${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('📥 Download started!'); // ✅ Toast
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('❌ Download failed! Please try again.'); // ✅ Toast
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this reel?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reel/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('✅ Reel deleted successfully!'); // ✅ Toast
                fetchAllReels();
            } else {
                const error = await response.json();
                toast.error('❌ Failed to delete: ' + (error.error || 'Unknown error')); // ✅ Toast
            }
        } catch (error) {
            console.error('Error deleting reel:', error);
            toast.error('❌ Failed to delete reel'); // ✅ Toast
        }
    };

    if (loading) {
        return <div className="loading">Loading reels...</div>;
    }

    if (reels.length === 0) {
        return (
            <div className="no-reels">
                <p>No reels created yet!</p>
                <Link to="/" className="create-btn">Create Your First Reel</Link>
            </div>
        );
    }

    return (
        <div className="reels-grid">
            {reels.map((reel) => (
                <div key={reel._id} className="reel-card">
                    <div className="reel-video">
                        <video 
                            controls 
                            muted 
                            style={{ width: '100%', borderRadius: '8px' }}
                        >
                            <source src={`http://localhost:3000${reel.videoUrl}`} type="video/mp4" />
                        </video>
                    </div>
                    <div className="reel-info">
                        <div className="reel-meta">
                            <span>🎵 {reel.usedMusic}</span>
                            <span>📐 {reel.usedTemplate}</span>
                        </div>
                        <div className="reel-date">
                            📅 {new Date(reel.createdAt).toLocaleDateString()}
                        </div>
                        <div className="reel-actions">
                            <button 
                                onClick={() => handleDownload(reel.videoUrl, `reel_${reel._id}.mp4`)}
                                className="download-btn-small"
                            >
                                📥 Download
                            </button>
                            <button 
                                onClick={() => handleDelete(reel._id)}
                                className="delete-btn-small"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReelsGrid;