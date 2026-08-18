import React, { useState, useEffect } from 'react';

interface SmartCutoutProps {
  src: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export const SmartCutout: React.FC<SmartCutoutProps> = ({ 
  src, 
  width = "100%", 
  height = "100%", 
  style 
}) => {
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const removeBackground = async () => {
      try {
        setLoading(true);
        
        // 1. Image URL ko fetch karke Blob mein convert karein
        const response = await fetch(src);
        const blob = await response.blob();

        // 2. FormData banakar backend upload route par bhejein
        const formData = new FormData();
        formData.append('image', blob, 'image.png');

        // Yeh aapka upload route hai jo aapne backend mein banaya hai
        const apiResponse = await fetch('http://localhost:5000/api/upload/remove-bg', {
          method: 'POST',
          body: formData,
        });

        const data = await apiResponse.json();

        if (isMounted && data.success) {
          const fullUrl = data.cutoutUrl.startsWith('http') 
            ? data.cutoutUrl 
            : `http://localhost:5000${data.cutoutUrl}`;
          setCutoutUrl(fullUrl);
        } else if (isMounted) {
          setCutoutUrl(src); // Fallback agar API fail ho jaye
        }
      } catch (err) {
        console.error("Background removal failed, using original:", err);
        if (isMounted) setCutoutUrl(src);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (src) {
      removeBackground();
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div 
      style={{ 
        width, 
        height, 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        ...style 
      }}
    >
      {loading ? (
       <div style={{ width: '100%', height: '100%' }} />
      ) : (
        <img 
          src={cutoutUrl || src} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))' 
          }} 
          alt="cutout sticker" 
        />
      )}
    </div>
  );
};