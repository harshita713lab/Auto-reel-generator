// frontend/src/components/TemplateSelector.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';  // ✅ 5000

// Emoji map for template effects
const effectEmojis = {
  none: '🎬',
  cinematic: '🎥',
  slide: '🖼️',
  fast_cut: '⚡',
  ken_burns: '🔍',
  montage: '🎞️'
};

// Color grade descriptions
const colorGradeLabels = {
  warm: '🌅 Warm',
  cool: '❄️ Cool',
  vibrant: '🌈 Vibrant',
  rose: '🌹 Rose',
  hdr: '✨ HDR',
  null: '🎨 Natural'
};

function TemplateSelector({ onSelect, selectedId, imageCount }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reel/templates`);
      const data = await res.json();
      if (data.success && data.templates) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Fallback to default templates
      setTemplates([
        {
          id: 'simple_1',
          name: '🎬 Classic Slideshow',
          slideDuration: 4,
          transition: 'fade',
          effect: 'none',
          colorGrade: null,
          vignette: false,
          quality: 'high',
          description: 'Simple slideshow with fade'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isTemplateCompatible = (template) => {
    if (!imageCount) return true;
    const min = template.minPhotos || 1;
    const max = template.maxPhotos || 30;
    return imageCount >= min && imageCount <= max;
  };

  const getCompatibilityMessage = (template) => {
    const min = template.minPhotos || 1;
    const max = template.maxPhotos || 30;
    if (imageCount < min) return `⚠️ Needs at least ${min} photos`;
    if (imageCount > max) return `⚠️ Max ${max} photos allowed`;
    return null;
  };

  const getDurationLabel = (duration) => {
    if (duration <= 1.5) return '⚡ Very Fast';
    if (duration <= 2.5) return '⏩ Fast';
    if (duration <= 4) return '▶️ Normal';
    return '🐢 Slow';
  };

  const getQualityLabel = (quality) => {
    const labels = { high: '⭐ High', medium: '🔸 Medium', low: '🔹 Low' };
    return labels[quality] || quality;
  };

  return (
    <div className="template-selector">
      <div className="template-selector-header" onClick={() => setExpanded(!expanded)}>
        <h3>🎨 Choose Template</h3>
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>▼</span>
      </div>

      {expanded && (
        <div className="template-grid">
          {loading ? (
            <div className="templates-loading">Loading templates...</div>
          ) : (
            templates.map((template) => {
              const compatible = isTemplateCompatible(template);
              const compatMessage = getCompatibilityMessage(template);
              const isSelected = selectedId === template.id;

              return (
                <div
                  key={template.id}
                  className={`template-card ${isSelected ? 'selected' : ''} ${!compatible ? 'incompatible' : ''}`}
                  onClick={() => {
                    if (compatible) {
                      onSelect(template.id);
                      toast.info(`🎬 Selected: ${template.name}`);
                    } else {
                      toast.warning(compatMessage);
                    }
                  }}
                >
                  <div className="template-card-header">
                    <span className="template-name">{template.name}</span>
                    {isSelected && <span className="selected-badge">✓</span>}
                  </div>

                  <div className="template-preview-badges">
                    <span className="badge badge-duration">{getDurationLabel(template.slideDuration)}</span>
                    <span className="badge badge-quality">{getQualityLabel(template.quality)}</span>
                    {template.vignette && <span className="badge badge-vignette">🌑 Vignette</span>}
                  </div>

                  <div className="template-details">
                    <div className="detail-row">
                      <span className="detail-label">⏱️ Duration</span>
                      <span className="detail-value">{template.slideDuration}s / slide</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🔄 Transition</span>
                      <span className="detail-value">{template.transition}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🎨 Color</span>
                      <span className="detail-value">{colorGradeLabels[template.colorGrade] || '🎨 Natural'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📸 Photos</span>
                      <span className="detail-value">{template.minPhotos || 1}-{template.maxPhotos || 30}</span>
                    </div>
                    {template.music && (
                      <div className="detail-row">
                        <span className="detail-label">🎵 Music</span>
                        <span className="detail-value">{template.music}</span>
                      </div>
                    )}
                  </div>

                  <p className="template-description">{template.description}</p>

                  {compatMessage && (
                    <div className="compatibility-warning">{compatMessage}</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Collapsed state shows selected template */}
      {!expanded && selectedId && (
        <div className="selected-template-summary">
          {templates.find(t => t.id === selectedId)?.name || 'Classic Slideshow'}
        </div>
      )}
    </div>
  );
}

export default TemplateSelector;