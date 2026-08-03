// src/pages/EditMusicPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMusic, faCheck, faFilm } from '@fortawesome/free-solid-svg-icons';
import GlitterBackground from '../components/GlitterBackground';
import MusicSelector from '../components/MusicSelector';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function EditMusicPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reel, setReel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMusicId, setSelectedMusicId] = useState('template_default');
    const [selectedStartTime, setSelectedStartTime] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [outputUrl, setOutputUrl] = useState('');

    useEffect(() => {
        if (id) {
            fetchReelDetails();
        }
    }, [id]);

    const fetchReelDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/reel/${id}`);
            const data = await res.json();
            if (res.ok && (data.data || data.reel)) {
                const r = data.data || data.reel;
                setReel(r);
                setOutputUrl(r.outputUrl || `/output/renders/${r.outputPath ? r.outputPath.split('\\').pop() : ''}`);
            } else {
                toast.error('Reel not found');
            }
        } catch (error) {
            console.error('Error fetching reel details:', error);
            toast.error('Failed to load reel details');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyMusicChange = async (targetMusicId = null, targetStartTime = null) => {
        if (!id) return;

        const musicIdToUse = targetMusicId !== null ? targetMusicId : selectedMusicId;
        const startTimeToUse = targetStartTime !== null ? targetStartTime : selectedStartTime;

        setUpdating(true);
        toast.info('🎶 Updating Reel Music...');

        try {
            const res = await fetch(`${API_URL}/reel/${id}/change-music`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    musicId: musicIdToUse,
                    musicStartTime: startTimeToUse,
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success('✨ Reel Music updated successfully!');
                if (data.outputUrl) setOutputUrl(data.outputUrl);
                if (data.data) setReel(data.data);
            } else {
                toast.error('❌ Failed to update music: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Error changing music:', err);
            toast.error('❌ Error updating music');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <GlitterBackground>
                <div className="loading" style={{ padding: '60px', textAlign: 'center', color: '#fff' }}>
                    Loading Reel Details...
                </div>
            </GlitterBackground>
        );
    }

    const fullVideoUrl = outputUrl
        ? (outputUrl.startsWith('http') ? outputUrl : `http://localhost:5000${outputUrl}`)
        : '';

    return (
        <GlitterBackground>
            <div className="edit-music-page-container">
                <div className="edit-music-page-header">
                    <button onClick={() => navigate('/all-reels')} className="edit-page-back-btn">
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Reels
                    </button>
                    <h1 className="edit-page-title">
                        <FontAwesomeIcon icon={faMusic} className="music-title-icon" /> Edit Reel Music
                    </h1>
                </div>

                <div className="edit-music-grid">
                    {/* Left Column: Fixed / Sticky Video Preview */}
                    <div className="edit-video-card sticky-video-card">
                        <h3 className="card-section-title">🎬 Reel Preview</h3>
                        {fullVideoUrl ? (
                            <video
                                key={fullVideoUrl}
                                controls
                                autoPlay
                                playsInline
                                className="edit-preview-video"
                            >
                                <source src={fullVideoUrl} type="video/mp4" />
                                Browser video playback not supported.
                            </video>
                        ) : (
                            <div className="no-video-placeholder">No video preview available</div>
                        )}

                        <div className="current-song-badge">
                            <div>🎵 Current Song: <strong>{reel?.usedMusic || 'Default Track'}</strong></div>
                            {reel?.musicStartTime > 0 && <div className="cut-start-info">✂️ Cut Start Time: {reel.musicStartTime} seconds</div>}
                        </div>
                    </div>

                    {/* Right Column: Scrollable Song Selector */}
                    <div className="edit-selector-card scrollable-songs-card">
                        <MusicSelector
                            onSelect={(id, startTime = 0) => {
                                setSelectedMusicId(id);
                                setSelectedStartTime(startTime);
                            }}
                            onApplyDirectly={(id, startTime = 0) => {
                                setSelectedMusicId(id);
                                setSelectedStartTime(startTime);
                                handleApplyMusicChange(id, startTime);
                            }}
                            selectedId={selectedMusicId}
                            selectedTemplateId={reel?.templateId}
                        />
                    </div>
                </div>
            </div>
        </GlitterBackground>
    );
}

export default EditMusicPage;
