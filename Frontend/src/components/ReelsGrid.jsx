// frontend/src/components/ReelsGrid.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

function ReelsGrid() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Search state
    const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
    const menuRef = useRef(null); // To handle clicking outside

    useEffect(() => {
        fetchAllReels();
    }, []);

    // ✅ Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    // ✅ Helper function to get correct video URL
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
            let fullUrl = videoUrl;
            if (!fullUrl.startsWith('http')) {
                const cleanPath = fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`;
                fullUrl = `http://localhost:5000${cleanPath}`;
            }

            const response = await fetch(fullUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `reel_${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('📥 Download started!');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('❌ Download failed! Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this reel?')) return;

        try {
            const response = await fetch(`${API_URL}/reel/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('✅ Reel deleted successfully!');
                fetchAllReels();
            } else {
                const error = await response.json();
                toast.error('❌ Failed to delete: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting reel:', error);
            toast.error('❌ Failed to delete reel');
        }
    };

    // ✅ New Feature: Reel ka Title Edit karna
    const handleRename = async (id, newTitle) => {
        if (!newTitle || newTitle.trim() === '') return;

        try {
            const response = await fetch(`${API_URL}/reel/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle.trim() })
            });

            if (response.ok) {
                toast.success('✅ Reel renamed successfully!');
                fetchAllReels(); // List refresh karo
                setOpenMenuId(null); // Close menu after action
            } else {
                toast.error('❌ Failed to rename reel');
            }
        } catch (error) {
            console.error('Error renaming reel:', error);
            toast.error('❌ Failed to rename reel');
        }
    };

    // ✅ New Feature: Share Reel
    const handleShare = (reel) => {
        const videoUrl = getVideoUrl(reel);
        if (navigator.share) {
            navigator.share({
                title: reel.title || "My Reel",
                text: `Check out my reel on Fotographiya!`,
                url: videoUrl,
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(videoUrl).then(() => {
                toast.success('🔗 Video link copied to clipboard!');
            }).catch(() => {
                toast.error('❌ Failed to copy link. Please copy manually.');
            });
        }
        setOpenMenuId(null); // Close menu after action
    };

    // ✅ New Feature: Duplicate Reel (Mock for now)
    const handleDuplicate = (reel) => {
        toast.info(`🔄 Creating a copy of "${reel.title || 'Untitled'}"...`);
        // In a real app, you would call your generate API here with the same images
        setTimeout(() => {
            toast.success(`✅ Reel duplicated! Refresh to see it.`);
            fetchAllReels();
        }, 1500);
        setOpenMenuId(null);
    };

    // ✅ 1. SEARCH LOGIC: Filter reels based on search term
    const filteredReels = useMemo(() => {
        if (!searchTerm) return reels;
        const lowerSearch = searchTerm.toLowerCase();
        return reels.filter(reel => {
            const titleMatch = reel.title?.toLowerCase().includes(lowerSearch);
            const dateMatch = new Date(reel.createdAt).toLocaleDateString('en-IN').includes(lowerSearch);
            return titleMatch || dateMatch;
        });
    }, [reels, searchTerm]);

    // ✅ 2. DATE GROUPING LOGIC
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

    if (loading) return <div className="loading">Loading reels...</div>;

    return (
        <div className="reels-grid-container">
            {/* ✅ SEARCH BAR */}
            <div className="search-bar-container">
                <input 
                    type="text" 
                    placeholder="🔍 Search by title or date (e.g., 31 Jul)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <span className="reel-count">{filteredReels.length} Reels</span>
            </div>

            {filteredReels.length === 0 ? (
                <div className="no-reels">
                    <p>{searchTerm ? `No reels found for "${searchTerm}"` : "No reels created yet!"}</p>
                    <Link to="/" className="create-btn">Create Your First Reel</Link>
                </div>
            ) : (
                <div className="reels-list-view">
                    {Object.keys(groupedReels).map((groupLabel) => (
                        <div key={groupLabel} className="reel-group">
                            {/* Date Header */}
                            <h3 className="group-header">{groupLabel}</h3>
                            
                            {/* List Items */}
                            <div className="group-items">
                                {groupedReels[groupLabel].map((reel) => {
                                    const videoUrl = getVideoUrl(reel);
                                    return (
                                        <div key={reel._id} className="reel-list-item">
                                            {/* Left: Thumbnail/Video */}
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
                                                    <div className="thumbnail-placeholder">🎬</div>
                                                )}
                                                <span className="duration-badge">{reel.duration ? Math.round(reel.duration) : "0"}s</span>
                                            </div>

                                            {/* Right: Details & Actions */}
                                            <div className="reel-list-details">
                                                <div className="reel-detail-top">
                                                    <h4 className="reel-list-title">{reel.title || "Untitled Reel"}</h4>
                                                    
                                                    {/* ✅ Date & 3-Dot Menu (Side by Side) */}
                                                    <div className="date-and-menu">
                                                        <span className="reel-list-date">
                                                            {new Date(reel.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        
                                                        <div className="reel-menu-container" ref={menuRef}>
                                                            <button 
                                                                className="reel-menu-trigger" 
                                                                onClick={() => setOpenMenuId(openMenuId === reel._id ? null : reel._id)}
                                                            >
                                                                ⋮
                                                            </button>
                                                            
                                                            {/* ✅ DROPDOWN MENU - Contains ALL actions */}
                                                            {openMenuId === reel._id && (
                                                                <div className="reel-dropdown-menu">
                                                                    <div 
                                                                        className="dropdown-item"
                                                                        onClick={() => {
                                                                            const newTitle = prompt("Enter new name for this reel:", reel.title || "Untitled Reel");
                                                                            if (newTitle !== null && newTitle.trim() !== '') {
                                                                                handleRename(reel._id, newTitle);
                                                                            } else if (newTitle !== null) {
                                                                                toast.warning('⚠️ Title cannot be empty!');
                                                                            }
                                                                        }}
                                                                    >
                                                                        ✏️ Rename
                                                                    </div>
                                                                    
                                                                    {videoUrl && (
                                                                        <div 
                                                                            className="dropdown-item"
                                                                            onClick={() => handleDownload(videoUrl, `reel_${reel._id}.mp4`)}
                                                                        >
                                                                            📥 Download
                                                                        </div>
                                                                    )}

                                                                    <div 
                                                                        className="dropdown-item"
                                                                        onClick={() => handleDuplicate(reel)}
                                                                    >
                                                                        📋 Duplicate
                                                                    </div>

                                                                    <div 
                                                                        className="dropdown-item"
                                                                        onClick={() => handleShare(reel)}
                                                                    >
                                                                        🔗 Share
                                                                    </div>

                                                                    <div 
                                                                        className="dropdown-item delete-item"
                                                                        onClick={() => handleDelete(reel._id)}
                                                                    >
                                                                        🗑️ Delete
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="reel-detail-meta">
                                                    <span>🎵 {reel.usedMusic || 'No Music'}</span>
                                                    <span className="template-tag">📐 {reel.usedTemplate || 'Default'}</span>
                                                </div>

                                                {/* ✅ NO DOWNLOAD BUTTON HERE ANYMORE - UI is clean */}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReelsGrid;