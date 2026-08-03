// frontend/src/components/MusicSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faScissors, faChevronDown, faCheck, faMusic, faSliders, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE = 'http://localhost:5000';

function MusicSelector({ onSelect, onApplyDirectly, selectedId, selectedTemplateId }) {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true); // Default open for ease of use
  const [playingId, setPlayingId] = useState(null);
  const [startTimeMap, setStartTimeMap] = useState({});
  const [editingTrack, setEditingTrack] = useState(null);
  const [tempStartTime, setTempStartTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

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

      const audio = new Audio(fullAudioUrl);
      audio.currentTime = trackStartSec;
      audio.play().catch(err => console.error('Audio play error:', err));
      audio.onended = () => setPlayingId(null);

      audioRef.current = audio;
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
    setStartTimeMap(prev => ({
      ...prev,
      [editingTrack.id]: tempStartTime
    }));

    onSelect(editingTrack.id, tempStartTime);
    toast.success(`✂️ Audio cut set to ${tempStartTime}s for ${editingTrack.title}`);
    
    // Auto trigger direct apply if provided
    if (onApplyDirectly) {
      onApplyDirectly(editingTrack.id, tempStartTime);
    }
    
    setEditingTrack(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const filteredMusic = musicList.filter(track => 
    track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (track.artist && track.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isTemplateDefaultSelected = selectedId === 'template_default' || !selectedId;

  return (
    <div className="music-selector-container">
      {/* Header toggle */}
      <div 
        className="music-selector-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="music-header-title">
          <FontAwesomeIcon icon={faMusic} className="header-icon" />
          <span>Select Song & Cut Audio</span>
        </div>
        <FontAwesomeIcon icon={faChevronDown} className={`chevron ${expanded ? 'open' : ''}`} />
      </div>

      {expanded && (
        <div className="music-selector-body">
          {/* 🔍 Search Bar for Searching Songs */}
          <div className="music-search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="🔍 Search songs by title or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="music-search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>

          {/* Option: Template Default Song */}
          <div 
            className={`music-card default-song-card ${isTemplateDefaultSelected ? 'selected' : ''}`}
            onClick={() => {
              onSelect('template_default', 0);
              toast.info('✨ Template Default Track Selected');
            }}
          >
            <div className="song-left-col">
              <div className="song-disc-icon default-disc">✨</div>
              <div className="song-meta">
                <div className="music-title">Template Fixed Default Song</div>
                <div className="music-desc">Pre-matched track for this template</div>
              </div>
            </div>
            <div className="song-right-actions">
              {onApplyDirectly && (
                <button 
                  className="direct-apply-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('template_default', 0);
                    onApplyDirectly('template_default', 0);
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} /> Apply
                </button>
              )}
              {isTemplateDefaultSelected && <span className="selected-badge">✓</span>}
            </div>
          </div>

          {/* Custom Tracks List */}
          <div className="music-grid-simple">
            {loading ? (
              <div className="music-loading">Loading audio tracks...</div>
            ) : filteredMusic.length === 0 ? (
              <div className="no-music-found">No songs match "{searchTerm}"</div>
            ) : (
              filteredMusic.map(track => {
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

                    {/* Right Side: Play Button + Cut Button + Direct Apply Button */}
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

                      {onApplyDirectly && (
                        <button
                          className="direct-apply-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(track.id, currentStartSec);
                            onApplyDirectly(track.id, currentStartSec);
                          }}
                          title="Apply this song immediately"
                        >
                          <FontAwesomeIcon icon={faCheck} /> Apply
                        </button>
                      )}

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
                <FontAwesomeIcon icon={faCheck} /> Done & Apply to Reel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicSelector;
