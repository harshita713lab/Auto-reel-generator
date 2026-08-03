// src/pages/DownloadHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faArrowLeft, faFileVideo, faClock, faMusic, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import GlitterBackground from '../components/GlitterBackground';

const API_URL = 'http://localhost:5000/api';

function DownloadHistory() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/reel/downloads/history`);
            const data = await res.json();
            setReels(data.reels || []);
        } catch (e) {
            toast.error('Failed to load download history');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (reel) => {
        try {
            const videoUrl = reel.outputUrl || `${API_URL}/reel/${reel._id}/download`;
            toast.info(<><FontAwesomeIcon icon={faDownload} /> Downloading reel...</>);
            const response = await fetch(videoUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${reel.title || 'reel'}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success(<><FontAwesomeIcon icon={faDownload} /> Download started!</>);
        } catch (error) {
            window.open(`${API_URL}/reel/${reel._id}/download`, '_blank');
        }
    };

    if (loading) return <div className="loading">Loading Download History...</div>;

    return (
        <GlitterBackground>
            <div className="downloads-page">
                <div className="downloads-container">
                    <div className="downloads-header">
                        <Link to="/settings" className="back-btn-downloads">
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Settings
                        </Link>
                        <h1><FontAwesomeIcon icon={faDownload} className="icon-primary" /> Download History</h1>
                    </div>

                    {reels.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-wrapper">
                                <FontAwesomeIcon icon={faFileVideo} className="empty-icon" />
                            </div>
                            <h3>No downloads yet</h3>
                            <p>Your created reels will appear here for instant download.</p>
                        </div>
                    ) : (
                        <div className="downloads-list">
                            {reels.map(reel => (
                                <div key={reel._id} className="download-item">
                                    <div className="download-item-info">
                                        <h4>{reel.title || "Untitled Reel"}</h4>
                                        <div className="download-meta">
                                            <span><FontAwesomeIcon icon={faClock} /> {new Date(reel.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            <span><FontAwesomeIcon icon={faMusic} /> {reel.usedMusic || 'Music'}</span>
                                            <span><FontAwesomeIcon icon={faLayerGroup} /> {reel.usedTemplate || 'Template'}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDownload(reel)} className="download-action-btn">
                                        <FontAwesomeIcon icon={faDownload} /> Download MP4
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GlitterBackground>
    );
}

export default DownloadHistory;