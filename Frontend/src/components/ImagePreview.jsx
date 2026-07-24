// frontend/src/components/ImagePreview.jsx
import React from 'react';
import ImageCard from './ImageCard';

function ImagePreview({ images, onDelete }) {
    // ✅ Sort images by ID (newest first)
    const sortedImages = [...images].reverse();
    
    return (
        <div className="preview-grid">
            {sortedImages.map((item) => (
                <ImageCard 
                    key={item.id}
                    id={item.id}
                    url={item.url}
                    name={item.name}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default ImagePreview;