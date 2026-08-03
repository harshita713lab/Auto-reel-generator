// frontend/src/components/LatestReel.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faFilm, faMusic, faLayerGroup, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/api';

function LatestReel() {
    const [latestReel, setLatestReel] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const confirmDelete = async () => {
        if (!latestReel) return;
        const id = latestReel._id;

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
        } finally {
            setShowDeleteModal(false);
        }
    };

    if (!latestReel) return null;

    const videoUrl = latestReel.outputUrl
        ? (latestReel.outputUrl.startsWith('http') ? latestReel.outputUrl : `${API_URL.replace('/api', '')}${latestReel.outputUrl}`)
        : `${API_URL}/reel/${latestReel._id}/download`;

    return (
        <div className="latest-reel-section">
            <div className="latest-reel-header">
                <h2>🎬 Latest Reel</h2>
                <div className="latest-reel-actions">
                    <Link to="/all-reels" className="view-all-pill-btn">
                        <FontAwesomeIcon icon={faFilm} /> View All Reels →
                    </Link>
                    <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="delete-pill-btn"
                    >
                        <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </button>
                </div>
            </div>

            <div className="latest-reel-preview">
                <video 
                    controls 
                    muted 
                    playsInline
                    style={{ width: '100%', maxHeight: '400px', borderRadius: '12px' }}
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support video playback.
                </video>
                <div className="latest-reel-info">
                    <span><FontAwesomeIcon icon={faMusic} /> {latestReel.usedMusic || 'Music'}</span>
                    <span><FontAwesomeIcon icon={faLayerGroup} /> {latestReel.usedTemplate || 'Template'}</span>
                    <span><FontAwesomeIcon icon={faCalendarDays} /> {new Date(latestReel.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Custom Beautiful Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="reel-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="reel-custom-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-icon">
                            <FontAwesomeIcon icon={faTrashCan} />
                        </div>
                        <h3>Delete Latest Reel?</h3>
                        <p>
                            Are you sure you want to delete <strong>"{latestReel.title || 'Latest Reel'}"</strong>? This action cannot be undone.
                        </p>
                        <div className="custom-modal-actions">
                            <button className="modal-btn cancel-btn" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="modal-btn confirm-delete-btn" onClick={confirmDelete}>
                                <FontAwesomeIcon icon={faTrashCan} /> Delete Reel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LatestReel;