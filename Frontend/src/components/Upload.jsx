// frontend/src/components/Upload.jsx
import React, { useRef } from 'react';

function Upload({ onAddImages, accept = "image/*,video/*", mode = "mixed" }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            onAddImages(selectedFiles);
        }
        e.target.value = null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            onAddImages(droppedFiles);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const getTitle = () => {
        if (mode === 'photos') return 'Drag & Drop Images';
        if (mode === 'videos') return 'Drag & Drop Video Clips';
        return 'Drag & Drop Photos or Video Clips';
    };

    const getSub = () => {
        if (mode === 'photos') return 'click to browse (JPG, PNG, WEBP)';
        if (mode === 'videos') return 'click to browse (MP4, MOV, WEBM)';
        return 'click to browse photos and video clips';
    };

    return (
        <div 
            className="drop-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <div className="drop-icon">{mode === 'photos' ? '📷' : mode === 'videos' ? '🎥' : '🎬'}</div>
            <div className="drop-text">
                <p className="drop-title">{getTitle()}</p>
                <p className="drop-sub">{getSub()}</p>
            </div>
            <input 
                type="file" 
                multiple 
                accept={accept} 
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
        </div>
    );
}

export default Upload;