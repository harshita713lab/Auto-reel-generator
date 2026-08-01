// src/pages/Trash.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faRotateLeft, faArrowLeft, faClock, faTrash } from '@fortawesome/free-solid-svg-icons';
import GlitterBackground from '../components/GlitterBackground';

const API_URL = 'http://localhost:5000/api';

function Trash() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchTrash(); }, []);

    const fetchTrash = async () => {
        try {
            const res = await fetch(`${API_URL}/reel/trash`);
            const data = await res.json();
            setReels(data.reels || []);
        } catch (e) { toast.error('Failed to load trash'); }
        finally { setLoading(false); }
    };

    const restoreReel = async (id) => {
        if(!window.confirm('Restore this reel back to your library?')) return;
        try {
            const res = await fetch(`${API_URL}/reel/${id}/restore`, { method: 'POST' });
            if(res.ok) { toast.success('Reel restored successfully!'); fetchTrash(); }
        } catch (e) { toast.error('Failed to restore'); }
    };

    const permanentDelete = async (id) => {
        if(!window.confirm('Delete permanently? This cannot be undone!')) return;
        try {
            const res = await fetch(`${API_URL}/reel/${id}/permanent`, { method: 'DELETE' });
            if(res.ok) { toast.success('Reel permanently deleted.'); fetchTrash(); }
        } catch (e) { toast.error('Failed to delete'); }
    };

    if(loading) return <div className="loading">Loading Trash...</div>;

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
                                        <span className="trash-date">
                                            <FontAwesomeIcon icon={faClock} /> Deleted: {new Date(reel.deletedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="trash-actions">
                                        <button onClick={() => restoreReel(reel._id)} className="restore-btn">
                                            <FontAwesomeIcon icon={faRotateLeft} /> Restore
                                        </button>
                                        <button onClick={() => permanentDelete(reel._id)} className="delete-perm-btn">
                                            <FontAwesomeIcon icon={faTrashCan} /> Delete Perm
                                        </button>
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

export default Trash;