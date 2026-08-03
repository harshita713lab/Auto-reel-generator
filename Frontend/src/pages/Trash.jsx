// src/pages/Trash.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faRotateLeft, faArrowLeft, faClock, faTrash, faMusic, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import GlitterBackground from '../components/GlitterBackground';

const API_URL = 'http://localhost:5000/api';

function Trash() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [restoreModalReel, setRestoreModalReel] = useState(null);
    const [permDeleteModalReel, setPermDeleteModalReel] = useState(null);

    useEffect(() => { 
        fetchTrash(); 
    }, []);

    const fetchTrash = async () => {
        try {
            const res = await fetch(`${API_URL}/reel/trash`);
            const data = await res.json();
            setReels(data.reels || []);
        } catch (e) { 
            toast.error('Failed to load trash'); 
        } finally { 
            setLoading(false); 
        }
    };

    const confirmRestore = async () => {
        if (!restoreModalReel) return;
        const id = restoreModalReel._id;

        try {
            const res = await fetch(`${API_URL}/reel/${id}/restore`, { method: 'POST' });
            if (res.ok) { 
                toast.success('✨ Reel restored successfully!'); 
                fetchTrash(); 
            } else {
                toast.error('Failed to restore reel');
            }
        } catch (e) { 
            toast.error('Failed to restore reel'); 
        } finally {
            setRestoreModalReel(null);
        }
    };

    const confirmPermanentDelete = async () => {
        if (!permDeleteModalReel) return;
        const id = permDeleteModalReel._id;

        try {
            const res = await fetch(`${API_URL}/reel/${id}/permanent`, { method: 'DELETE' });
            if (res.ok) { 
                toast.success('🗑️ Reel permanently deleted.'); 
                fetchTrash(); 
            } else {
                toast.error('Failed to delete permanently');
            }
        } catch (e) { 
            toast.error('Failed to delete reel'); 
        } finally {
            setPermDeleteModalReel(null);
        }
    };

    if (loading) return <div className="loading">Loading Trash...</div>;

    return (
        <GlitterBackground>
            <div className="trash-page">
                <div className="trash-container">
                    <div className="trash-header">
                        <Link to="/settings" className="back-btn-trash">
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Settings
                        </Link>
                        <h1><FontAwesomeIcon icon={faTrashCan} className="icon-danger" /> Trash</h1>
                    </div>

                    {reels.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-wrapper">
                                <FontAwesomeIcon icon={faTrash} className="empty-icon" />
                            </div>
                            <h3>Trash is empty</h3>
                            <p>Items deleted will appear here for 30 days before permanent removal.</p>
                        </div>
                    ) : (
                        <div className="trash-list">
                            {reels.map(reel => (
                                <div key={reel._id} className="trash-item">
                                    <div className="trash-item-info">
                                        <h4>{reel.title || "Untitled Reel"}</h4>
                                        <div className="trash-meta">
                                            <span><FontAwesomeIcon icon={faClock} /> Deleted: {new Date(reel.deletedAt || reel.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            <span><FontAwesomeIcon icon={faMusic} /> {reel.usedMusic || 'Music'}</span>
                                        </div>
                                    </div>
                                    <div className="trash-actions">
                                        <button onClick={() => setRestoreModalReel(reel)} className="restore-btn">
                                            <FontAwesomeIcon icon={faRotateLeft} /> Restore
                                        </button>
                                        <button onClick={() => setPermDeleteModalReel(reel)} className="delete-perm-btn">
                                            <FontAwesomeIcon icon={faTrashCan} /> Delete Perm
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom Restore Modal */}
                {restoreModalReel && (
                    <div className="reel-modal-overlay" onClick={() => setRestoreModalReel(null)}>
                        <div className="reel-custom-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="rename-modal-icon">
                                <FontAwesomeIcon icon={faRotateLeft} />
                            </div>
                            <h3>Restore Reel?</h3>
                            <p>
                                Do you want to restore <strong>"{restoreModalReel.title || 'Reel'}"</strong> back to your Reels Library?
                            </p>
                            <div className="custom-modal-actions">
                                <button className="modal-btn cancel-btn" onClick={() => setRestoreModalReel(null)}>
                                    Cancel
                                </button>
                                <button className="modal-btn save-btn" onClick={confirmRestore}>
                                    <FontAwesomeIcon icon={faRotateLeft} /> Restore Reel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Permanent Delete Modal */}
                {permDeleteModalReel && (
                    <div className="reel-modal-overlay" onClick={() => setPermDeleteModalReel(null)}>
                        <div className="reel-custom-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="delete-modal-icon">
                                <FontAwesomeIcon icon={faTrashCan} />
                            </div>
                            <h3>Delete Permanently?</h3>
                            <p>
                                Are you sure you want to permanently delete <strong>"{permDeleteModalReel.title || 'Reel'}"</strong>? This action cannot be undone!
                            </p>
                            <div className="custom-modal-actions">
                                <button className="modal-btn cancel-btn" onClick={() => setPermDeleteModalReel(null)}>
                                    Cancel
                                </button>
                                <button className="modal-btn confirm-delete-btn" onClick={confirmPermanentDelete}>
                                    <FontAwesomeIcon icon={faTrashCan} /> Permanent Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </GlitterBackground>
    );
}

export default Trash;