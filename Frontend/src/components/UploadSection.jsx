// frontend/src/components/UploadSection.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Upload from './Upload';
import ImagePreview from './ImagePreview';
import Result from './Result';
import TemplateSelector from './TemplateSelector';

const API_URL = 'http://localhost:5000/api';

function UploadSection() {
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [reelData, setReelData] = useState(null);
    const [useShotstack, setUseShotstack] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState('simple_1');

    const handleAddImages = (files) => {
        const newImages = [...images, ...files];
        
        // ✅ Allow up to 100 images
        if (newImages.length > 100) {
            toast.warning('⚠️ Maximum 100 images allowed');
            return;
        }
        
        setImages(newImages);

        const urls = files.map(file => ({
            id: Date.now() + Math.random(),
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size
        }));
        setPreviewUrls([...previewUrls, ...urls]);
        setReelData(null);
        toast.info(`📸 ${files.length} image(s) added! (Total: ${newImages.length})`);
    };

    const handleDeleteImage = (id) => {
        const index = previewUrls.findIndex(item => item.id === id);
        if (index !== -1) {
            const updatedImages = [...images];
            updatedImages.splice(index, 1);
            setImages(updatedImages);

            const updatedUrls = previewUrls.filter(item => item.id !== id);
            setPreviewUrls(updatedUrls);
        }
    };

    const handleClearAll = () => {
        setImages([]);
        setPreviewUrls([]);
        setReelData(null);
        toast.info('🗑️ All images cleared');
    };

    const handleSubmit = async () => {
        // ✅ Minimum 1 photo required
        if (images.length < 1) {
            toast.warning('⚠️ Please upload at least 1 image');
            return;
        }

        setLoading(true);
        setProgress(20);
        setStatus('Uploading...');
        setReelData(null);

        const formData = new FormData();
        images.forEach(file => formData.append('images', file));

        try {
            setProgress(30);
            setStatus('Uploading images...');
            
            const uploadRes = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) {
                const error = await uploadRes.json();
                throw new Error(error.error || 'Upload failed');
            }

            const uploadData = await uploadRes.json();

            setProgress(60);
            setStatus('Generating reel...');

            const generateUrl = useShotstack 
                ? `${API_URL}/reel/generate-shotstack`
                : `${API_URL}/reel/generate`;

            const reelRes = await fetch(generateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    images: uploadData.files,
                    templateId: selectedTemplateId
                })
            });

            if (!reelRes.ok) {
                const error = await reelRes.json();
                throw new Error(error.error || 'Reel generation failed');
            }

            const reelData = await reelRes.json();

            setProgress(100);
            setStatus('✅ Reel Ready!');
            
            setReelData({
                downloadUrl: reelData.url || reelData.videoUrl,
                music: reelData.usedMusic || 'Upbeat',
                template: reelData.usedTemplate || 'Auto',
                reelId: reelData.reelId || reelData.renderId,
                provider: useShotstack ? 'Shotstack' : 'FFmpeg'
            });
            setLoading(false);
            toast.success(`🎬 Reel created successfully with ${images.length} images!`);

        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Error: ' + error.message);
            setLoading(false);
        }
    };

    const handleReset = () => {
        setImages([]);
        setPreviewUrls([]);
        setReelData(null);
        setProgress(0);
        setStatus('');
        toast.info('🔄 Ready to create a new reel!');
    };

    return (
        <div className="upload-section">
            <div className="upload-card">
                <h2>📸 Create Your Reel</h2>
                <p>Upload 1-100 images and get a professional Reel instantly</p>

                <div className="provider-toggle">
                    <label className="toggle-label">
                        <span>⚡ FFmpeg (Local)</span>
                        <input
                            type="checkbox"
                            checked={useShotstack}
                            onChange={() => setUseShotstack(!useShotstack)}
                        />
                        <span className="toggle-slider"></span>
                        <span>☁️ Shotstack (Cloud)</span>
                    </label>
                    <small className="toggle-hint">
                        {useShotstack 
                            ? '🎬 Using cloud rendering (faster, better quality)' 
                            : '🖥️ Using local FFmpeg (free, no API limit)'}
                    </small>
                </div>

                {!reelData ? (
                    <>
                        <Upload onAddImages={handleAddImages} />

                        {previewUrls.length > 0 && (
                            <>
                                <div className="preview-header">
                                    <h3>📸 {previewUrls.length} Images {previewUrls.length >= 10 ? '🔥' : ''}</h3>
                                    <button className="clear-btn" onClick={handleClearAll}>
                                        🗑️ Clear All
                                    </button>
                                </div>
                                <ImagePreview 
                                    images={previewUrls} 
                                    onDelete={handleDeleteImage} 
                                />

                                <TemplateSelector 
                                    onSelect={setSelectedTemplateId}
                                    selectedId={selectedTemplateId}
                                    imageCount={images.length}
                                />
                            </>
                        )}

                        {loading && (
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p>{status}</p>
                            </div>
                        )}

                        <button 
                            className="submit-btn" 
                            onClick={handleSubmit}
                            disabled={loading || images.length < 1}
                        >
                            {loading ? 'Creating...' : `🚀 Create Reel (${images.length} images)`}
                        </button>

                        {images.length > 0 && images.length < 1 && (
                            <p className="hint">Need at least 1 image</p>
                        )}
                        
                        {images.length >= 30 && (
                            <p className="hint" style={{ color: '#ffa502' }}>
                                ⚡ {images.length} images! This will be an epic montage!
                            </p>
                        )}
                    </>
                ) : (
                    <Result reelData={reelData} onReset={handleReset} />
                )}
            </div>
        </div>
    );
}

export default UploadSection;