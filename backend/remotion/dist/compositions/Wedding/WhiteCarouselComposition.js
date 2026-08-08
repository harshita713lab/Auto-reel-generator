import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, } from "remotion";
import { AnimatedImage, } from "../../components";
export const WhiteCardCarousel = ({ images = [], music, slideDuration = 1, title = "Wedding Gallery", subtitle = "", backgroundColor = "#efefef", showTitle = true, showCounter = true, showDots = true, cardColor = "#ffffff", cardRadius = 28, cardShadow = true, }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const slideFrames = Math.round(slideDuration * fps);
    const totalImages = Math.max(images.length, 1);
    const currentIndex = Math.floor(frame / slideFrames) % totalImages;
    const currentImage = images[currentIndex];
    const localFrame = frame % slideFrames;
    // card entry animation
    const cardScale = spring({
        frame: localFrame,
        fps,
        config: {
            damping: 14,
            stiffness: 120,
        },
    });
    const scale = interpolate(cardScale, [0, 1], [0.9, 1]);
    const opacity = interpolate(localFrame, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    // slide animation
    const translateX = interpolate(localFrame, [0, slideFrames], [60, -60], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (_jsxs(AbsoluteFill, { style: {
            background: backgroundColor,
            justifyContent: "space-between",
            alignItems: "center",
            padding: 60,
        }, children: [showTitle && (_jsxs("div", { style: {
                    width: "100%",
                    textAlign: "center",
                    marginTop: 10,
                }, children: [_jsx("div", { style: {
                            fontSize: 58,
                            fontWeight: 700,
                            color: "#222",
                        }, children: title }), subtitle && (_jsx("div", { style: {
                            marginTop: 10,
                            fontSize: 28,
                            color: "#666",
                        }, children: subtitle }))] })), _jsx("div", { style: {
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }, children: currentImage && (_jsxs("div", { style: {
                        width: 820,
                        height: 1180,
                        background: cardColor,
                        borderRadius: cardRadius,
                        overflow: "hidden",
                        position: "relative",
                        transform: `translateX(${translateX}px) scale(${scale})`,
                        opacity,
                        boxShadow: cardShadow
                            ? "0 30px 70px rgba(0,0,0,0.18)"
                            : "none",
                    }, children: [_jsx("div", { style: {
                                position: "absolute",
                                inset: 18,
                                borderRadius: cardRadius - 10,
                                overflow: "hidden",
                                background: "#fff",
                            }, children: _jsx(AnimatedImage, { src: currentImage.path, animation: "kenBurns", durationInFrames: slideFrames, style: {
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                } }) }), showCounter && (_jsxs("div", { style: {
                                position: "absolute",
                                right: 24,
                                bottom: 24,
                                background: "rgba(0,0,0,0.55)",
                                color: "#fff",
                                padding: "10px 18px",
                                borderRadius: 999,
                                fontSize: 24,
                                fontWeight: 600,
                            }, children: [String(currentIndex + 1).padStart(2, "0"), " /", " ", String(images.length).padStart(2, "0")] }))] })) })] }));
};
export default WhiteCardCarousel;
