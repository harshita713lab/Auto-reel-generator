// frontend/src/components/ReelsGrid.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GlitterBackground from '../components/GlitterBackground';
import { 
    faEllipsisVertical, faPenToSquare, faDownload, faCopy, faShareNodes, 
    faTrashCan, faMusic, faLayerGroup, faFilm, faPlay, faXmark,
    faPaperPlane, faCamera, faThumbsUp, faEnvelope, faComment, faLink
} from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:5000/api';

function ReelsGrid() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [openMenuId, setOpenMenuId] = useState(null); 
    const [shareModal, setShareModal] = useState(null); 
    const [activePlayReel, setActivePlayReel] = useState(null);

    // Beautiful Custom Modals State
    const [deleteModalReel, setDeleteModalReel] = useState(null);
    const [renameModalReel, setRenameModalReel] = useState(null);
    const [renameTitleInput, setRenameTitleInput] = useState('');

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
        if (!reel) return null;
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

    const getThumbnailUrl = (reel) => {
        if (!reel) return null;
        if (reel.thumbnailUrl) {
            return reel.thumbnailUrl.startsWith('http') ? reel.thumbnailUrl : `http://localhost:5000${reel.thumbnailUrl}`;
        }
        if (reel.previewUrl && !reel.previewUrl.endsWith('.mp4')) {
            return reel.previewUrl.startsWith('http') ? reel.previewUrl : `http://localhost:5000${reel.previewUrl}`;
        }
        if (reel.images && Array.isArray(reel.images) && reel.images.length > 0) {
            const firstImg = reel.images[0];
            const imgPath = typeof firstImg === 'object' ? (firstImg.path || firstImg.url || '') : String(firstImg);
            const filename = imgPath.split('/').pop() || imgPath.split('\\').pop();
            if (filename) {
                return `http://localhost:5000/uploads/images/${filename}`;
            }
        }
        return null;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const formattedDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const formattedTime = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        return `${formattedDate} • ${formattedTime}`;
    };

    const handleDownload = async (videoUrl, filename) => {
        try {
            toast.info(<><FontAwesomeIcon icon={faDownload} /> Downloading reel...</>);
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

    const confirmDelete = async () => {
        if (!deleteModalReel) return;
        const id = deleteModalReel._id;

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
        } finally {
            setDeleteModalReel(null);
            setOpenMenuId(null);
        }
    };

    const confirmRename = async () => {
        if (!renameModalReel || !renameTitleInput || renameTitleInput.trim() === '') {
            toast.warning('Title cannot be empty!');
            return;
        }

        const id = renameModalReel._id;
        const newTitle = renameTitleInput.trim();

        try {
            const response = await fetch(`${API_URL}/reel/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle })
            });

            if (response.ok) {
                toast.success(<><FontAwesomeIcon icon={faPenToSquare} /> Reel renamed successfully!</>);
                fetchAllReels();
            } else {
                toast.error(<><FontAwesomeIcon icon={faPenToSquare} /> Failed to rename reel</>);
            }
        } catch (error) {
            console.error('Error renaming reel:', error);
            toast.error(<><FontAwesomeIcon icon={faPenToSquare} /> Failed to rename reel</>);
        } finally {
            setRenameModalReel(null);
            setOpenMenuId(null);
        }
    };

    const handleDuplicate = async (reel) => {
        try {
            toast.info(<><FontAwesomeIcon icon={faCopy} /> Duplicating reel...</>);
            const response = await fetch(`${API_URL}/reel/${reel._id}/duplicate`, {
                method: 'POST'
            });
            if (response.ok) {
                toast.success(<><FontAwesomeIcon icon={faCopy} /> Reel duplicated successfully!</>);
                fetchAllReels();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to duplicate reel');
            }
        } catch (error) {
            console.error('Error duplicating reel:', error);
            toast.error('Failed to duplicate reel');
        } finally {
            setOpenMenuId(null);
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
        const text = encodeURIComponent(`Check out my reel "${title || 'Reel'}" on Fotographiya Reel Maker!`);
        
        let url = '';
        switch (platform) {
            case 'telegram':
                url = `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
                break;
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'email':
                url = `mailto:?subject=${encodedTitle}&body=${text}%0A${encodedUrl}`;
                break;
            case 'instagram':
                navigator.clipboard.writeText(videoUrl).then(() => {
                    toast.success(<><FontAwesomeIcon icon={faLink} /> Reel link copied! Open Instagram to share.</>);
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

    // Enhanced Search by Title, Date, Template, or Music
    const filteredReels = useMemo(() => {
        if (!searchTerm || !searchTerm.trim()) return reels;
        const lowerSearch = searchTerm.toLowerCase().trim();
        return reels.filter(reel => {
            const titleMatch = reel.title?.toLowerCase().includes(lowerSearch);
            const musicMatch = reel.usedMusic?.toLowerCase().includes(lowerSearch);
            const templateMatch = reel.usedTemplate?.toLowerCase().includes(lowerSearch);
            
            const dateObj = new Date(reel.createdAt);
            const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
            const dateMatch = dateStr.includes(lowerSearch);

            return titleMatch || musicMatch || templateMatch || dateMatch;
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
                        placeholder="Search by title, date (e.g. Aug 3), template..." 
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
                        <p>{searchTerm ? `No reels found matching "${searchTerm}"` : "No reels created yet!"}</p>
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
                                        const thumbnailUrl = getThumbnailUrl(reel);
                                        const isMenuOpen = openMenuId === reel._id;

                                        return (
                                            <div 
                                                key={reel._id} 
                                                className={`reel-list-item ${isMenuOpen ? 'active-menu-item' : ''}`}
                                                style={{ zIndex: isMenuOpen ? 9999 : 1, position: 'relative' }}
                                            >
                                                <div 
                                                    className="reel-list-thumbnail"
                                                    onClick={() => videoUrl && setActivePlayReel(reel)}
                                                    title="Click to play reel"
                                                >
                                                    {thumbnailUrl ? (
                                                        <img 
                                                            src={thumbnailUrl} 
                                                            alt={reel.title || "Reel"}
                                                            className="thumbnail-img"
                                                        />
                                                    ) : (
                                                        <div className="thumbnail-placeholder">
                                                            <FontAwesomeIcon icon={faFilm} />
                                                        </div>
                                                    )}
                                                    
                                                    {videoUrl && (
                                                        <div className="play-overlay">
                                                            <FontAwesomeIcon icon={faPlay} className="play-icon-overlay" />
                                                        </div>
                                                    )}

                                                    <span className="duration-badge">{reel.duration ? Math.round(reel.duration) : "0"}s</span>
                                                </div>

                                                <div className="reel-list-details">
                                                    <div className="reel-detail-top">
                                                        <h4 
                                                            className="reel-list-title clickable"
                                                            onClick={() => videoUrl && setActivePlayReel(reel)}
                                                        >
                                                            {reel.title || "Untitled Reel"}
                                                        </h4>
                                                        
                                                        <div className="date-and-menu">
                                                            <span className="reel-list-date">
                                                                📅 {formatDate(reel.createdAt)}
                                                            </span>
                                                            
                                                            <div className="reel-menu-container">
                                                                <button 
                                                                    className={`reel-menu-trigger ${isMenuOpen ? 'active' : ''}`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenMenuId(isMenuOpen ? null : reel._id);
                                                                    }}
                                                                    title="Options"
                                                                >
                                                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                                                </button>
                                                                
                                                                {isMenuOpen && (
                                                                    <div className="reel-dropdown-menu">
                                                                        <div 
                                                                            className="dropdown-item"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setRenameModalReel(reel);
                                                                                setRenameTitleInput(reel.title || '');
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPenToSquare} /> Rename
                                                                        </div>
                                                                        
                                                                        {videoUrl && (
                                                                            <div 
                                                                                className="dropdown-item"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDownload(videoUrl, `reel_${reel._id}.mp4`);
                                                                                    setOpenMenuId(null);
                                                                                }}
                                                                            >
                                                                                <FontAwesomeIcon icon={faDownload} /> Download
                                                                            </div>
                                                                        )}

                                                                        <div 
                                                                            className="dropdown-item"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDuplicate(reel);
                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon icon={faCopy} /> Duplicate
                                                                        </div>

                                                                        <div 
                                                                            className="dropdown-item"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleShare(reel);
                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon icon={faShareNodes} /> Share
                                                                        </div>

                                                                        <div 
                                                                            className="dropdown-item delete-item"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setDeleteModalReel(reel);
                                                                                setOpenMenuId(null);
                                                                            }}
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

                {/* Video Playback Modal */}
                {activePlayReel && (
                    <div className="reel-modal-overlay" onClick={() => setActivePlayReel(null)}>
                        <div className="reel-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="reel-modal-header">
                                <h3>🎬 {activePlayReel.title || "Untitled Reel"}</h3>
                                <button className="reel-modal-close" onClick={() => setActivePlayReel(null)}>✕</button>
                            </div>
                            
                            <div className="reel-video-wrapper">
                                <video 
                                    src={getVideoUrl(activePlayReel)} 
                                    controls 
                                    autoPlay 
                                    className="reel-modal-video"
                                />
                            </div>

                            <div className="reel-modal-info">
                                <span><FontAwesomeIcon icon={faMusic} /> {activePlayReel.usedMusic || 'Default Music'}</span>
                                <span><FontAwesomeIcon icon={faLayerGroup} /> {activePlayReel.usedTemplate || 'Default Template'}</span>
                                <span>📅 {formatDate(activePlayReel.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Beautiful Delete Confirmation Modal */}
                {deleteModalReel && (
                    <div className="reel-modal-overlay" onClick={() => setDeleteModalReel(null)}>
                        <div className="reel-custom-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="delete-modal-icon">
                                <FontAwesomeIcon icon={faTrashCan} />
                            </div>
                            <h3>Delete Reel?</h3>
                            <p>
                                Are you sure you want to delete <strong>"{deleteModalReel.title || 'Untitled Reel'}"</strong>? This action cannot be undone.
                            </p>
                            <div className="custom-modal-actions">
                                <button className="modal-btn cancel-btn" onClick={() => setDeleteModalReel(null)}>
                                    Cancel
                                </button>
                                <button className="modal-btn confirm-delete-btn" onClick={confirmDelete}>
                                    <FontAwesomeIcon icon={faTrashCan} /> Delete Reel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Beautiful Rename Modal */}
                {renameModalReel && (
                    <div className="reel-modal-overlay" onClick={() => setRenameModalReel(null)}>
                        <div className="reel-custom-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="rename-modal-icon">
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                            <h3>Rename Reel</h3>
                            <p>Enter a new title for this reel:</p>
                            <input 
                                type="text"
                                className="rename-modal-input"
                                value={renameTitleInput}
                                onChange={(e) => setRenameTitleInput(e.target.value)}
                                placeholder="Reel Title..."
                                autoFocus
                            />
                            <div className="custom-modal-actions">
                                <button className="modal-btn cancel-btn" onClick={() => setRenameModalReel(null)}>
                                    Cancel
                                </button>
                                <button className="modal-btn save-btn" onClick={confirmRename}>
                                    Save Title
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Share Modal */}
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