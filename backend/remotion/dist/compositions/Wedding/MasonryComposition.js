import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, } from "remotion";
import { AnimatedImage } from "../../components";
import { getBeatScale } from "../../utils/beatUtils";
export const WhiteCardMasonry = ({ images = [], backgroundColor = "#000000", beatTimestamps = [], }) => {
    const frame = useCurrentFrame();
    const { fps, width } = useVideoConfig();
    const beatScale = getBeatScale(frame, fps, beatTimestamps);
    const imageList = images.slice(0, 8);
    // Phase 1 (0 to 120 frames / 0-4s): Masonry Collage FIRST
    // Phase 2 (120 to 450 frames / 4-15s): 1-by-1 FAST Full Reel Showcase AFTER
    const gridEndFrame = 120;
    const isGridPhase = frame < gridEndFrame;
    const spotlightFrame = Math.max(0, frame - gridEndFrame);
    const spotlightDurationPerImage = 41; // ~1.37s per photo
    const currentSpotlightIndex = !isGridPhase && imageList.length > 0
        ? Math.min(imageList.length - 1, Math.floor(spotlightFrame / spotlightDurationPerImage))
        : 0;
    const spotlightLocalFrame = spotlightFrame % spotlightDurationPerImage;
    // FAST Left / Right Slide Entry
    const isEven = currentSpotlightIndex % 2 === 0;
    const startX = isEven ? -width : width;
    const slideX = interpolate(spotlightLocalFrame, [0, 8], // Fast 8-frame snappy slide entry
    [startX, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const page1 = imageList.slice(0, 6);
    const page2 = imageList.slice(2, 8);
    const slideStart = 50;
    const page1X = interpolate(frame, [slideStart, slideStart + 25], [0, -width], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const page2X = interpolate(frame, [slideStart, slideStart + 25], [width, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const renderCard = (img, index) => {
        const delay = index * 2;
        const enter = spring({
            fps,
            frame: frame - delay,
            config: { damping: 15, stiffness: 80 },
        });
        const y = interpolate(enter, [0, 1], [100, 0]);
        const scale = interpolate(enter, [0, 1], [0.85, 1]);
        return (_jsx("div", { style: {
                flex: 1,
                overflow: "hidden",
                borderRadius: 16,
                background: "#111",
                boxShadow: "0 10px 30px rgba(0,0,0,.5)",
                transform: `translateY(${y}px) scale(${scale})`,
            }, children: _jsx(Img, { src: img.path, style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                } }) }, index));
    };
    const renderPage = (page) => {
        const left = page.filter((_, i) => i % 2 === 0);
        const right = page.filter((_, i) => i % 2 === 1);
        return (_jsxs("div", { style: {
                position: "absolute",
                inset: 0,
                display: "flex",
                gap: 16,
                padding: 20,
            }, children: [_jsx("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 16 }, children: left.map((img, i) => renderCard(img, i * 2)) }), _jsx("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 16 }, children: right.map((img, i) => renderCard(img, i * 2 + 1)) })] }));
    };
    return (_jsxs(AbsoluteFill, { style: {
            background: backgroundColor,
            overflow: "hidden",
        }, children: [isGridPhase && (_jsxs("div", { style: {
                    position: "absolute",
                    inset: 0,
                    transform: `scale(${beatScale})`,
                    opacity: interpolate(frame, [0, 10, 110, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }, children: [_jsx("div", { style: {
                            position: "absolute",
                            inset: 0,
                            transform: `translateX(${page1X}px)`,
                        }, children: renderPage(page1) }), _jsx("div", { style: {
                            position: "absolute",
                            inset: 0,
                            transform: `translateX(${page2X}px)`,
                        }, children: renderPage(page2) })] })), !isGridPhase && imageList[currentSpotlightIndex] && (_jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    transform: `translateX(${slideX}px) scale(${beatScale})`,
                    zIndex: 20,
                    overflow: "hidden",
                }, children: _jsx(AnimatedImage, { src: imageList[currentSpotlightIndex].path, animation: "kenBurns", durationInFrames: spotlightDurationPerImage, style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    } }) }))] }));
};
export default WhiteCardMasonry;
