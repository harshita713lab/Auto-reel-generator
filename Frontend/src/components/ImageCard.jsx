import React from 'react';

function ImageCard({ id, url, name, onDelete }) {
    return (
        <div className="image-card">
            <img src={url} alt={name} />
            <div className="card-overlay">
                <button className="delete-btn" onClick={() => onDelete(id)}>
                    ✕
                </button>
            </div>
        </div>
    );
}

export default ImageCard;