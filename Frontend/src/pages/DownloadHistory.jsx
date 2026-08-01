// src/pages/DownloadHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faArrowLeft, faFileVideo, faClock } from '@fortawesome/free-solid-svg-icons';
import GlitterBackground from '../components/GlitterBackground';

const API_URL = 'http://localhost:5000/api';

function DownloadHistory() {
    const [reels, setReels] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/reel/downloads/history`)
            .then(res => res.json())
            .then(data => setReels(data.reels || []));
    }, []);

    return (
        <GlitterBackground>
            <div className="downloads-page">
                <div className="downloads-container">
                    <div className="downloads-header">
                        <Link to="/settings" className="back-btn-downloads">
                            <FontAwesomeIcon icon={faArrowLeft} /> Back
                        </Link>
                        <h1><FontAwesomeIcon icon={faDownload} className="icon-primary" /> Download History</h1>
                    </div>

                    {reels.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-wrapper">
                                <FontAwesomeIcon icon={faFileVideo} className="empty-icon" />
                            </div>
                            <h3>No downloads yet</h3>
                            <p>Your downloaded reels will appear here.</p>
                        </div>
                    ) : (
                        <div className="downloads-list">
                            {reels.map(reel => (
                                <div key={reel._id} className="download-item">
                                    <div className="download-item-info">
                                        <h4>{reel.title || "Untitled Reel"}</h4>
                                        <span className="download-date">
                                            <FontAwesomeIcon icon={faClock} /> Created: {new Date(reel.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="download-count-badge">
                                        <FontAwesomeIcon icon={faDownload} />
                                        <span>{reel.downloadCount || 0}</span>
                                    </div>
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