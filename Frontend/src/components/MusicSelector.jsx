// frontend/src/components/MusicSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE = 'http://localhost:5000';

function MusicSelector({ onSelect, selectedId, selectedTemplateId }) {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/music`);
      const data = await res.json();
      if (data.success && data.data) {
        setMusicList(data.data);
      }
    } catch (error) {
      console.error('Failed to load music list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlay = (e, track) => {
    e.stopPropagation();
    const fullAudioUrl = track.url?.startsWith('http')
      ? track.url
      : `${BACKEND_BASE}${track.url}`;

    if (playingId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(fullAudioUrl);
      audioRef.current.play().catch(err => console.error('Audio play error:', err));
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(track.id);
    }
  };

  const isTemplateDefaultSelected = !selectedId || selectedId === 'template_default';

  return (
    <div className="music-selector">
      <div className="music-selector-header" onClick={() => setExpanded(!expanded)}>
        <div className="music-header-title">
          <h3>🎵 Background Song</h3>
          <span className="selected-music-badge">
            {isTemplateDefaultSelected
              ? '✨ Template Default Song'
              : (musicList.find(m => m.id === selectedId)?.title || selectedId)}
          </span>
        </div>
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>▼</span>
      </div>

      {expanded && (
        <div className="music-selection-panel">
          <p className="music-subtitle">
            Every template has its own fixed song. Choose a custom track below if you'd like to change it!
          </p>

          {/* Option 1: Template Default Song */}
          <div
            className={`music-card ${isTemplateDefaultSelected ? 'selected' : ''}`}
            onClick={() => {
              onSelect('template_default');
              toast.info('✨ Using template\'s fixed default song');
            }}
          >
            <div className="music-card-info">
              <span className="music-icon">🌟</span>
              <div>
                <div className="music-title">Template Fixed Song</div>
                <div className="music-desc">Plays the song pre-matched to your chosen template</div>
              </div>
            </div>
            {isTemplateDefaultSelected && <span className="selected-badge">✓</span>}
          </div>

          {/* Custom Tracks List */}
          <div className="music-grid">
            {loading ? (
              <div className="music-loading">Loading audio tracks...</div>
            ) : (
              musicList.map(track => {
                const isSelected = selectedId === track.id;
                const isPlaying = playingId === track.id;

                return (
                  <div
                    key={track.id}
                    className={`music-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onSelect(track.id);
                      toast.info(`🎵 Selected: ${track.title}`);
                    }}
                  >
                    <div className="music-card-info">
                      <button
                        className={`play-btn ${isPlaying ? 'playing' : ''}`}
                        onClick={(e) => handleTogglePlay(e, track)}
                        title={isPlaying ? 'Pause Preview' : 'Play Preview'}
                      >
                        {isPlaying ? '⏸️' : '▶️'}
                      </button>
                      <div>
                        <div className="music-title">{track.title}</div>
                        <div className="music-artist">{track.artist || 'Auto Reel Track'}</div>
                      </div>
                    </div>
                    {isSelected && <span className="selected-badge">✓</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Collapsed state summary */}
      {!expanded && (
        <div className="selected-music-summary">
          {isTemplateDefaultSelected ? (
            <span>✨ Using Template Fixed Default Song</span>
          ) : (
            <span>🎵 Selected Song: <strong>{musicList.find(m => m.id === selectedId)?.title || selectedId}</strong></span>
          )}
        </div>
      )}
    </div>
  );
}

export default MusicSelector;
