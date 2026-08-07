import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate } from "remotion";
export const MemoryBlendComposition = ({ images = [], introText = "Our little love story.", music, }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    const imageList = images.length > 0 ? images : [];
    // Static Image
    const staticImage = imageList.length > 0 ? imageList[0] : null;
    // Overlay Images
    const overlayImages = imageList.slice(1);
    // Har 1.2 sec me image change
    const overlayFramesPerImage = Math.round(fps * 1.2);
    const overlayImageIndex = overlayImages.length > 0
        ? Math.floor(frame / overlayFramesPerImage) % overlayImages.length
        : 0;
    const overlayImage = overlayImages.length > 0
        ? overlayImages[overlayImageIndex]
        : null;
    // Fade + Zoom
    const localFrame = frame % overlayFramesPerImage;
    const overlayOpacity = interpolate(localFrame, [0, 8, overlayFramesPerImage - 8, overlayFramesPerImage], [0, 1, 1, 0]);
    const overlayScale = interpolate(localFrame, [0, overlayFramesPerImage], [1.08, 1]);
    return (_jsxs(AbsoluteFill, { style: { backgroundColor: "#000" }, children: [staticImage && (_jsx(Img, { src: staticImage.path, style: {
                    position: "absolute",
                    width: "58%",
                    height: "72%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                    objectFit: "cover",
                    borderRadius: 25,
                    boxShadow: "0 20px 50px rgba(0,0,0,.4)",
                } })), overlayImage && (_jsx(Img, { src: overlayImage.path, style: {
                    position: "absolute",
                    width: "58%",
                    height: "72%",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%,-50%) scale(${overlayScale})`,
                    objectFit: "cover",
                    borderRadius: 25,
                    opacity: overlayOpacity,
                    boxShadow: "0 25px 60px rgba(0,0,0,.5)",
                } })), _jsx(AbsoluteFill, { style: {
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: frame < fps * 3 || frame > durationInFrames - fps * 3 ? "rgba(0,0,0,0.6)" : "transparent",
                }, children: _jsx("h1", { style: {
                        color: "#ffffff",
                        fontFamily: "sans-serif",
                        fontSize: "46px",
                        textAlign: "center",
                        fontWeight: "500",
                        textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                        padding: "0 20px",
                    }, children: frame < fps * 4 ? introText : "" }) })] }));
};
