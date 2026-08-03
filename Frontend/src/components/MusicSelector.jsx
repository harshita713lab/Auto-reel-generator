// frontend/src/components/MusicSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faScissors, faChevronDown, faCheck, faMusic, faSliders } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE = 'http://localhost:5000';

function MusicSelector({ onSelect, selectedId, selectedTemplateId }) {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [startTimeMap, setStartTimeMap] = useState({});
  const [editingTrack, setEditingTrack] = useState(null); // Snapchat Trimmer Modal state
  const [tempStartTime, setTempStartTime] = useState(0);

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

  const handleTogglePlay = (e, track, forceStartSec = null) => {
    if (e) e.stopPropagation();
    const fullAudioUrl = track.url?.startsWith('http')
      ? track.url
      : `${BACKEND_BASE}${track.url}`;

    const trackStartSec = forceStartSec !== null ? forceStartSec : (startTimeMap[track.id] || 0);

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
      audioRef.current.currentTime = trackStartSec;
      audioRef.current.play().catch(err => console.error('Audio play error:', err));
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(track.id);
    }
  };

  const openSnapchatEditor = (e, track) => {
    e.stopPropagation();
    setEditingTrack(track);
    setTempStartTime(startTimeMap[track.id] || 0);
  };

  const saveSnapchatCut = () => {
    if (!editingTrack) return;
    const trackId = editingTrack.id;
    setStartTimeMap(prev => ({ ...prev, [trackId]: tempStartTime }));
    onSelect(trackId, tempStartTime);
    toast.success(`🎵 Added "${editingTrack.title}" (Starts at ${formatSeconds(tempStartTime)}) to Reel!`);
    if (audioRef.current) audioRef.current.pause();
    setPlayingId(null);
    setEditingTrack(null);
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </div>

      {expanded && (
        <div className="music-selection-panel">
          <p className="music-subtitle">
            Select a song or click <strong>✂️ Cut / Edit</strong> to choose exact start time for your Reel!
          </p>

          {/* Option 1: Template Default Song */}
          <div
            className={`music-card clean-song-row ${isTemplateDefaultSelected ? 'selected' : ''}`}
            onClick={() => {
              onSelect('template_default', 0);
              toast.info('✨ Using template\'s fixed default song');
            }}
          >
            <div className="song-left-col">
              <div className="song-disc-icon default-disc">✨</div>
              <div className="song-meta">
                <div className="music-title">Template Fixed Song</div>
                <div className="music-desc">Pre-matched song for your chosen template</div>
              </div>
            </div>
            {isTemplateDefaultSelected && <span className="selected-badge">✓</span>}
          </div>

          {/* Custom Tracks List (Snapchat Simple Rows) */}
          <div className="music-grid-simple">
            {loading ? (
              <div className="music-loading">Loading audio tracks...</div>
            ) : (
              musicList.map(track => {
                const isSelected = selectedId === track.id;
                const isPlaying = playingId === track.id;
                const currentStartSec = startTimeMap[track.id] || 0;

                return (
                  <div
                    key={track.id}
                    className={`music-card clean-song-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onSelect(track.id, currentStartSec);
                      toast.info(`🎵 Selected: ${track.title}`);
                    }}
                  >
                    {/* Left Side: Disc Icon + Song Title & Artist */}
                    <div className="song-left-col">
                      <div className="song-disc-icon">🎵</div>
                      <div className="song-meta">
                        <div className="music-title">{track.title}</div>
                        <div className="music-artist">
                          {track.artist || 'Full MP3 Song'}
                          {currentStartSec > 0 && <span className="cut-tag"> • Cut: {formatSeconds(currentStartSec)}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Play/Pause Button + ✂️ Edit Button */}
                    <div className="song-right-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`play-btn-round ${isPlaying ? 'playing' : ''}`}
                        onClick={(e) => handleTogglePlay(e, track)}
                        title={isPlaying ? 'Pause Preview' : 'Play Preview'}
                      >
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                      </button>

                      <button
                        className="snapchat-edit-btn"
                        onClick={(e) => openSnapchatEditor(e, track)}
                        title="Cut/Edit Song Start Time"
                      >
                        <FontAwesomeIcon icon={faScissors} /> Cut
                      </button>

                      {isSelected && <span className="selected-badge">✓</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Snapchat-Style Audio Trimmer Modal */}
      {editingTrack && (
        <div className="reel-modal-overlay" onClick={() => setEditingTrack(null)}>
          <div className="snapchat-trimmer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="trimmer-header">
              <div className="trimmer-icon">
                <FontAwesomeIcon icon={faScissors} />
              </div>
              <h3>Cut Audio Clip</h3>
              <p>Select start point for <strong>"{editingTrack.title}"</strong></p>
            </div>

            <div className="trimmer-body">
              <div className="time-display-badge">
                Start Time: <span>{formatSeconds(tempStartTime)}</span>
              </div>

              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={tempStartTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setTempStartTime(val);
                  if (playingId === editingTrack.id && audioRef.current) {
                    audioRef.current.currentTime = val;
                  }
                }}
                className="snapchat-range-slider"
              />

              <div className="trimmer-preview-row">
                <button
                  className="preview-cut-btn"
                  onClick={() => handleTogglePlay(null, editingTrack, tempStartTime)}
                >
                  <FontAwesomeIcon icon={playingId === editingTrack.id ? faPause : faPlay} />
                  {playingId === editingTrack.id ? ' Pause Cut Preview' : ' Play Cut Preview'}
                </button>
              </div>
            </div>

            <div className="trimmer-footer">
              <button
                className="snapchat-done-btn"
                onClick={saveSnapchatCut}
              >
                <FontAwesomeIcon icon={faCheck} /> Done (Add to Reel)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed state summary */}
      {!expanded && (
        <div className="selected-music-summary">
          {isTemplateDefaultSelected ? (
            <span>✨ Using Template Fixed Default Song</span>
          ) : (
            <span>🎵 Selected Song: <strong>{musicList.find(m => m.id === selectedId)?.title || selectedId}</strong> (Starts at {formatSeconds(startTimeMap[selectedId] || 0)})</span>
          )}
        </div>
      )}
    </div>
  );
}

export default MusicSelector;
