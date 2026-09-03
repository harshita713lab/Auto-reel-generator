import React, { useState } from 'react';
import { Play, Pause, Trash2, Scissors, Film } from 'lucide-react';

export const VideoCardPreview = ({
  item,
  index,
  onRemove,
  onTrimChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);

  const duration = item.duration || 5;
  const startOffset = item.startOffset || 0;
  const slotLength = 3; // Standard slot target

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSliderChange = (e) => {
    const newOffset = parseFloat(e.target.value);
    if (onTrimChange) {
      onTrimChange(index, newOffset);
    }
    if (videoRef.current) {
      videoRef.current.currentTime = newOffset;
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m > 0 ? m + ':' : ''}${s < 10 ? '0' : ''}${s}s`;
  };

  const maxOffset = Math.max(0, duration - 1);

  return (
    <div className="relative group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-md flex flex-col">
      {/* Video Container */}
      <div className="relative aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
        {item.previewUrl || item.url || item.path ? (
          <video
            ref={videoRef}
            src={item.previewUrl || item.url || item.path}
            className="w-full h-full object-cover"
            onEnded={() => setIsPlaying(false)}
            muted
            playsInline
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 gap-1">
            <Film className="w-8 h-8" />
            <span className="text-xs">Video Clip</span>
          </div>
        )}

        {/* Video Overlay Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-medium border border-white/10">
          <Film className="w-3 h-3 text-indigo-400" />
          <span>{formatTime(duration)}</span>
        </div>

        {/* Play/Pause Center Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </div>
        </button>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove && onRemove(index)}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Clip Trimmer Control Bar */}
      {duration > slotLength && (
        <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Scissors className="w-3 h-3 text-indigo-400" /> Trim Start:
            </span>
            <span className="font-mono text-indigo-300 font-semibold">
              {startOffset.toFixed(1)}s - {(startOffset + Math.min(slotLength, duration - startOffset)).toFixed(1)}s
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={maxOffset}
            step={0.1}
            value={startOffset}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      )}
    </div>
  );
};

export default VideoCardPreview;
