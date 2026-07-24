// frontend/src/components/Upload.jsx
import React, { useRef } from 'react';

function Upload({ onAddImages }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            // ✅ Allow all images, no limit
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

    return (
        <div 
            className="drop-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <div className="drop-icon">📷</div>
            <div className="drop-text">
                <p className="drop-title">Drag & Drop Images</p>
                <p className="drop-sub">or click to browse (JPG, PNG, WEBP) - 1 to 100 images</p>
            </div>
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
        </div>
    );
}

export default Upload;