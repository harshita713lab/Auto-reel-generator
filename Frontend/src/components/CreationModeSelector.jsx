import React from 'react';
import { Camera, Video, Layers } from 'lucide-react';

export const CreationModeSelector = ({ activeMode = 'mixed', onModeChange }) => {
  const modes = [
    {
      id: 'photos',
      label: '📷 Photos Only',
      desc: 'Create reels from images',
      icon: Camera,
      badge: 'Photos',
    },
    {
      id: 'videos',
      label: '🎥 Videos Only',
      desc: 'Stitch video clips into a reel',
      icon: Video,
      badge: 'Video Clips',
    },
    {
      id: 'mixed',
      label: '🔀 Photos + Videos',
      desc: 'Mix photos and video clips',
      icon: Layers,
      badge: 'Mixed Reel',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1 text-center">
        Select Reel Creation Mode
      </div>
      <div className="grid grid-cols-3 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onModeChange && onModeChange(mode.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                <span className="font-semibold text-sm">{mode.badge}</span>
              </div>
              <span className={`text-[11px] text-center line-clamp-1 ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                {mode.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CreationModeSelector;
