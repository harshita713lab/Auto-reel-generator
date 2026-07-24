// frontend/src/components/LatestReel.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000'; // ✅ ADD THIS

function LatestReel() {
    const [latestReel, setLatestReel] = useState(null);

    useEffect(() => {
        fetchLatestReel();
    }, []);

    const fetchLatestReel = async () => {
        try {
            const response = await fetch(`${API_URL}/reel/latest`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.reel) {
                    setLatestReel(data.reel);
                }
            }
        } catch (error) {
            console.error('Error fetching latest reel:', error);
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
                toast.success('✅ Reel deleted successfully!');
                setLatestReel(null);
            } else {
                const error = await response.json();
                toast.error('❌ Failed to delete: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting reel:', error);
            toast.error('❌ Failed to delete reel');
        }
    };

    if (!latestReel) return null;

    return (
        <div className="latest-reel-section">
            <div className="latest-reel-header">
                <h2>🎬 Latest Reel</h2>
                <div className="latest-reel-actions">
                    <Link to="/all-reels" className="view-all-btn">View All →</Link>
                    <button 
                        onClick={() => handleDelete(latestReel._id)}
                        className="delete-btn-small"
                        style={{ marginLeft: '12px' }}
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
            <div className="latest-reel-preview">
                <video 
                    controls 
                    muted 
                    style={{ width: '100%', maxHeight: '400px', borderRadius: '12px' }}
                >
                    {/* ✅ FIX: http://localhost:3000 → BASE_URL */}
                    <source src={`${BASE_URL}${latestReel.videoUrl}`} type="video/mp4" />
                </video>
                <div className="latest-reel-info">
                    <span>🎵 {latestReel.usedMusic}</span>
                    <span>📐 {latestReel.usedTemplate}</span>
                    <span>📅 {new Date(latestReel.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}

export default LatestReel;