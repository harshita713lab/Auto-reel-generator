// src/pages/EditMusicPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMusic, faCheck, faFilm, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
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

    const handleApplyMusicChange = async () => {
        if (!id) return;

        setUpdating(true);
        toast.info('🎶 Updating Reel Music...');

        try {
            const res = await fetch(`${API_URL}/reel/${id}/change-music`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    musicId: selectedMusicId,
                    musicStartTime: selectedStartTime,
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
            <div className="edit-music-page" style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                <div className="edit-music-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <button onClick={() => navigate(-1)} className="back-btn-settings" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </button>
                    <h1 style={{ fontSize: '1.8rem', color: '#fff', margin: 0 }}>
                        <FontAwesomeIcon icon={faMusic} style={{ color: '#a29bfe' }} /> Edit Reel Music
                    </h1>
                </div>

                <div className="edit-music-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
                    {/* Left Column: Video Preview */}
                    <div className="edit-video-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '20px' }}>
                        <h3 style={{ color: '#fff', marginBottom: '16px' }}>🎬 Reel Preview</h3>
                        {fullVideoUrl ? (
                            <video
                                key={fullVideoUrl}
                                controls
                                autoPlay
                                playsInline
                                style={{ width: '100%', maxHeight: '480px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <source src={fullVideoUrl} type="video/mp4" />
                                Browser video playback not supported.
                            </video>
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>No video preview available</div>
                        )}

                        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(108,92,231,0.15)', borderRadius: '12px', border: '1px solid rgba(108,92,231,0.3)', color: '#a29bfe' }}>
                            <div>🎵 Current Song: <strong>{reel?.usedMusic || 'Default Track'}</strong></div>
                            {reel?.musicStartTime > 0 && <div style={{ fontSize: '12px', marginTop: '4px' }}>✂️ Cut Start Time: {reel.musicStartTime} seconds</div>}
                        </div>
                    </div>

                    {/* Right Column: Song Selector & Apply Button */}
                    <div className="edit-selector-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '20px' }}>
                        <h3 style={{ color: '#fff', marginBottom: '16px' }}>🎶 Select New Song & Cut Audio</h3>

                        <MusicSelector
                            onSelect={(id, startTime = 0) => {
                                setSelectedMusicId(id);
                                setSelectedStartTime(startTime);
                            }}
                            selectedId={selectedMusicId}
                            selectedTemplateId={reel?.templateId}
                        />

                        <button
                            onClick={handleApplyMusicChange}
                            disabled={updating}
                            style={{
                                width: '100%',
                                marginTop: '24px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#fff',
                                border: 'none',
                                padding: '14px',
                                borderRadius: '16px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <FontAwesomeIcon icon={faCheck} /> {updating ? 'Applying New Music...' : 'Apply New Song to Reel'}
                        </button>
                    </div>
                </div>
            </div>
        </GlitterBackground>
    );
}

export default EditMusicPage;
