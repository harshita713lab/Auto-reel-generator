// frontend/src/components/ReelsGrid.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GlitterBackground from '../components/GlitterBackground';
import { 
    faEllipsisVertical, faPenToSquare, faDownload, faCopy, faShareNodes, 
    faTrashCan, faMusic, faLayerGroup, faMagnifyingGlass, faFilm,
    faPaperPlane, faCamera, faThumbsUp, faEnvelope, faComment, faLink
} from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:5000/api';

function ReelsGrid() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [openMenuId, setOpenMenuId] = useState(null); 
    const [shareModal, setShareModal] = useState(null); 

    useEffect(() => {
        fetchAllReels();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId && !event.target.closest('.reel-menu-container')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const fetchAllReels = async () => {
        try {
            const response = await fetch(`${API_URL}/reel/all`);
            if (response.ok) {
                const data = await response.json();
                setReels(data.reels || []);
            } else {
                console.error('❌ Failed to fetch reels:', response.status);
                toast.error('Failed to load reels');
            }
        } catch (error) {
            console.error('❌ Error fetching reels:', error);
            toast.error('Failed to load reels');
        } finally {
            setLoading(false);
        }
    };

    const getVideoUrl = (reel) => {
        if (reel.outputUrl) {
            return reel.outputUrl.startsWith('http') 
                ? reel.outputUrl 
                : `http://localhost:5000${reel.outputUrl.startsWith('/') ? '' : '/'}${reel.outputUrl}`;
        }
        if (reel.outputPath) {
            const filename = reel.outputPath.split('/').pop() || reel.outputPath.split('\\').pop();
            return `http://localhost:5000/output/renders/${filename}`; 
        }
        return null;
    };

    const handleDownload = async (videoUrl, filename) => {
        try {
            toast.info(<><FontAwesomeIcon icon={faDownload} /> Downloading...</>);
            const response = await fetch(videoUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `reel_${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success(<><FontAwesomeIcon icon={faDownload} /> Download started!</>);
        } catch (error) {
            console.error('Download failed:', error);
            toast.error(<><FontAwesomeIcon icon={faDownload} /> Download failed! Please try again.</>);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this reel?')) return;

        try {
            const response = await fetch(`${API_URL}/reel/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success(<><FontAwesomeIcon icon={faTrashCan} /> Reel deleted successfully!</>);
                fetchAllReels();
            } else {
                const error = await response.json();
                toast.error(<><FontAwesomeIcon icon={faTrashCan} /> Failed to delete: {error.error || 'Unknown error'}</>);
            }
        } catch (error) {
            console.error('Error deleting reel:', error);
            toast.error(<><FontAwesomeIcon icon={faTrashCan} /> Failed to delete reel</>);
        }
    };

    const handleRename = async (id, newTitle) => {
        if (!newTitle || newTitle.trim() === '') return;

        try {
            const response = await fetch(`${API_URL}/reel/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle.trim() })
            });

            if (response.ok) {
                toast.success(<><FontAwesomeIcon icon={faPenToSquare} /> Reel renamed successfully!</>);
                fetchAllReels();
                setOpenMenuId(null);
            } else {
                toast.error(<><FontAwesomeIcon icon={faPenToSquare} /> Failed to rename reel</>);
            }
        } catch (error) {
            console.error('Error renaming reel:', error);
            toast.error(<><FontAwesomeIcon icon={faPenToSquare} /> Failed to rename reel</>);
        }
    };

    const handleShare = (reel) => {
        const videoUrl = getVideoUrl(reel);
        setShareModal({ reel, videoUrl });
        setOpenMenuId(null); 
    };

    const closeShareModal = () => {
        setShareModal(null);
    };

    const shareViaPlatform = (platform, videoUrl, title) => {
        const encodedUrl = encodeURIComponent(videoUrl || '');
        const encodedTitle = encodeURIComponent(title || 'My Reel');
        const text = encodeURIComponent(`Check out my reel on Fotographiya!`);
        
        let url = '';
        switch (platform) {
            case 'telegram':
                url = `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${text}%20${encodedUrl}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${text}`;
                break;
            case 'email':
                url = `mailto:?subject=${encodedTitle}&body=${text}%0A${encodedUrl}`;
                break;
            case 'instagram':
                navigator.clipboard.writeText(videoUrl).then(() => {
                    toast.success(<><FontAwesomeIcon icon={faLink} /> Link copied! Paste it in Instagram.</>);
                }).catch(() => {
                    toast.error(<><FontAwesomeIcon icon={faLink} /> Failed to copy link.</>);
                });
                closeShareModal();
                return;
            case 'copy':
                navigator.clipboard.writeText(videoUrl).then(() => {
                    toast.success(<><FontAwesomeIcon icon={faLink} /> Link copied to clipboard!</>);
                }).catch(() => {
                    toast.error(<><FontAwesomeIcon icon={faLink} /> Failed to copy link.</>);
                });
                closeShareModal();
                return;
            default:
                return;
        }
        
        window.open(url, '_blank', 'noopener,noreferrer');
        closeShareModal();
    };

    const handleDuplicate = (reel) => {
        toast.info(<><FontAwesomeIcon icon={faCopy} /> Creating a copy...</>);
        setTimeout(() => {
            toast.success(<><FontAwesomeIcon icon={faCopy} /> Reel duplicated! Refresh to see it.</>);
            fetchAllReels();
        }, 1500);
        setOpenMenuId(null);
    };

    const filteredReels = useMemo(() => {
        if (!searchTerm) return reels;
        const lowerSearch = searchTerm.toLowerCase();
        return reels.filter(reel => {
            const titleMatch = reel.title?.toLowerCase().includes(lowerSearch);
            const dateMatch = new Date(reel.createdAt).toLocaleDateString('en-IN').includes(lowerSearch);
            return titleMatch || dateMatch;
        });
    }, [reels, searchTerm]);

    const groupReelsByDate = (reelsList) => {
        const groups = {};
        const today = new Date();
        today.setHours(0,0,0,0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        reelsList.forEach(reel => {
            const reelDate = new Date(reel.createdAt);
            reelDate.setHours(0,0,0,0);

            let groupLabel = '';
            if (reelDate.getTime() === today.getTime()) {
                groupLabel = 'Today';
            } else if (reelDate.getTime() === yesterday.getTime()) {
                groupLabel = 'Yesterday';
            } else {
                groupLabel = reelDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }

            if (!groups[groupLabel]) {
                groups[groupLabel] = [];
            }
            groups[groupLabel].push(reel);
        });

        return groups;
    };

    const groupedReels = groupReelsByDate(filteredReels);

    if (loading) return <div className="loading"><FontAwesomeIcon icon={faFilm} /> Loading reels...</div>;

    return (
        <GlitterBackground>
            <div className="reels-grid-container">
                <div className="search-bar-container">
                    <input 
                        type="text" 
                        placeholder="Search by title or date..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="reel-count">
                        <FontAwesomeIcon icon={faFilm} /> {filteredReels.length} Reels
                    </span>
                </div>

                {filteredReels.length === 0 ? (
                    <div className="no-reels">
                        <p>{searchTerm ? `No reels found` : "No reels created yet!"}</p>
                        <Link to="/" className="create-btn">Create Your First Reel</Link>
                    </div>
                ) : (
                    <div className="reels-list-view">
                        {Object.keys(groupedReels).map((groupLabel) => (
                            <div key={groupLabel} className="reel-group">
                                <h3 className="group-header">{groupLabel}</h3>
                                <div className="group-items">
                                    {groupedReels[groupLabel].map((reel) => {
                                        const videoUrl = getVideoUrl(reel);
                                        return (
                                            <div key={reel._id} className="reel-list-item">
                                                <div className="reel-list-thumbnail">
                                                    {videoUrl ? (
                                                        <video 
                                                            muted 
                                                            playsInline
                                                            poster={videoUrl}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                                        >
                                                            <source src={videoUrl} type="video/mp4" />
                                                        </video>
                                                    ) : (
                                                        <div className="thumbnail-placeholder">
                                                            <FontAwesomeIcon icon={faFilm} />
                                                        </div>
                                                    )}
                                                    <span className="duration-badge">{reel.duration ? Math.round(reel.duration) : "0"}s</span>
                                                </div>

                                                <div className="reel-list-details">
                                                    <div className="reel-detail-top">
                                                        <h4 className="reel-list-title">{reel.title || "Untitled Reel"}</h4>
                                                        
                                                        <div className="date-and-menu">
                                                            <span className="reel-list-date">
                                                                {new Date(reel.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            
                                                            <div className="reel-menu-container">
                                                                <button 
                                                                    className="reel-menu-trigger" 
                                                                    onClick={() => setOpenMenuId(openMenuId === reel._id ? null : reel._id)}
                                                                >
                                                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                                                </button>
                                                                
                                                                {openMenuId === reel._id && (
                                                                    <div className="reel-dropdown-menu">
                                                                        <div 
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                const newTitle = prompt("Enter new name for this reel:", reel.title || "Untitled Reel");
                                                                                if (newTitle !== null && newTitle.trim() !== '') {
                                                                                    handleRename(reel._id, newTitle);
                                                                                } else if (newTitle !== null) {
                                                                                    toast.warning('Title cannot be empty!');
                                                                                }
                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPenToSquare} /> Rename
                                                                        </div>
                                                                        
                                                                        {videoUrl && (
                                                                            <div 
                                                                                className="dropdown-item"
                                                                                onClick={() => handleDownload(videoUrl, `reel_${reel._id}.mp4`)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faDownload} /> Download
                                                                            </div>
                                                                        )}

                                                                        <div 
                                                                            className="dropdown-item"
                                                                            onClick={() => handleDuplicate(reel)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faCopy} /> Duplicate
                                                                        </div>

                                                                        <div 
                                                                            className="dropdown-item"
                                                                            onClick={() => handleShare(reel)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faShareNodes} /> Share
                                                                        </div>

                                                                        <div 
                                                                            className="dropdown-item delete-item"
                                                                            onClick={() => handleDelete(reel._id)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrashCan} /> Delete
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="reel-detail-meta">
                                                        <span>
                                                            <FontAwesomeIcon icon={faMusic} /> {reel.usedMusic || 'No Music'}
                                                        </span>
                                                        <span className="template-tag">
                                                            <FontAwesomeIcon icon={faLayerGroup} /> {reel.usedTemplate || 'Default'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {shareModal && (
                    <div className="share-modal-overlay" onClick={closeShareModal}>
                        <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="share-modal-header">
                                <h3><FontAwesomeIcon icon={faShareNodes} /> Share Reel</h3>
                                <button className="share-modal-close" onClick={closeShareModal}>✕</button>
                            </div>
                            <p className="share-modal-title">{shareModal.reel.title || 'Untitled Reel'}</p>
                            <div className="share-options">
                                <button className="share-option" onClick={() => shareViaPlatform('telegram', shareModal.videoUrl, shareModal.reel.title)}>
                                    <FontAwesomeIcon icon={faPaperPlane} className="share-icon" />
                                    <span className="share-label">Telegram</span>
                                </button>
                                <button className="share-option" onClick={() => shareViaPlatform('instagram', shareModal.videoUrl, shareModal.reel.title)}>
                                    <FontAwesomeIcon icon={faCamera} className="share-icon" />
                                    <span className="share-label">Instagram</span>
                                </button>
                                <button className="share-option" onClick={() => shareViaPlatform('facebook', shareModal.videoUrl, shareModal.reel.title)}>
                                    <FontAwesomeIcon icon={faThumbsUp} className="share-icon" />
                                    <span className="share-label">Facebook</span>
                                </button>
                                <button className="share-option" onClick={() => shareViaPlatform('email', shareModal.videoUrl, shareModal.reel.title)}>
                                    <FontAwesomeIcon icon={faEnvelope} className="share-icon" />
                                    <span className="share-label">Email</span>
                                </button>
                                <button className="share-option" onClick={() => shareViaPlatform('whatsapp', shareModal.videoUrl, shareModal.reel.title)}>
                                    <FontAwesomeIcon icon={faComment} className="share-icon" />
                                    <span className="share-label">WhatsApp</span>
                                </button>
                                <button className="share-option copy-link" onClick={() => shareViaPlatform('copy', shareModal.videoUrl, shareModal.reel.title)}>
                                    <FontAwesomeIcon icon={faLink} className="share-icon" />
                                    <span className="share-label">Copy Link</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </GlitterBackground>
    );
}

export default ReelsGrid;