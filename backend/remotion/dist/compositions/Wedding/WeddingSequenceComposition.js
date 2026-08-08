import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, } from "remotion";
import { AnimatedImage } from "../../components";
import { PremiumGrid } from "./PreiumGrid";
const WeddingSequenceComposition = ({ images = [], music, }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    // Scene Durations
    const rowDuration = 120;
    const fastDuration = 90;
    const CardDuration = 120;
    const gridDuration = 120;
    const totalDuration = rowDuration +
        fastDuration +
        CardDuration +
        gridDuration;
    // Images
    const img1 = images[0];
    const img2 = images[1];
    const img3 = images[2];
    const img4 = images[3];
    const img5 = images[4];
    const img6 = images[5];
    const img7 = images[6];
    const img8 = images[7];
    const img9 = images[8];
    const img10 = images[9];
    const img11 = images[10];
    const img12 = images[11];
    const img13 = images[12];
    const img14 = images[13];
    const img15 = images[14];
    const img16 = images[15];
    const gridImages = [
        images[16],
        images[17],
        images[18],
        images[19],
    ].filter(Boolean);
    // -----------------------------------
    // Row Image
    // -----------------------------------
    const RowImage = ({ image, }) => {
        if (!image)
            return null;
        return (_jsx(AnimatedImage, { src: image.path, animation: image.animation ?? "slideUp", durationInFrames: 20, style: {
                width: "100%",
                height: "32%",
                objectFit: "cover",
                borderRadius: 18,
            } }));
    };
    // -----------------------------------
    // Rotating Card Image
    // -----------------------------------
    const CardImage = ({ image, delay = 0, }) => {
        const frame = useCurrentFrame();
        if (!image)
            return null;
        const rotate = interpolate(frame - delay, [0, 20], [-180, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        const scale = interpolate(frame - delay, [0, 20], [0.4, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        return (_jsx("div", { style: {
                width: 300,
                height: 220,
                background: "#fff",
                padding: 12,
                borderRadius: 18,
                boxShadow: "0 15px 40px rgba(0,0,0,.5)",
                transform: `rotate(${rotate + 5}deg) scale(${scale})`,
                opacity,
            }, children: _jsx("img", { src: image.path, style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 12,
                } }) }));
    };
    // -----------------------------------
    // Fast Image
    // -----------------------------------
    const FlashImage = ({ image, }) => {
        if (!image)
            return null;
        return (_jsx(AnimatedImage, { src: image.path, animation: image.animation ?? "zoomIn", durationInFrames: 9, style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
            } }));
    };
    return (_jsxs(AbsoluteFill, { style: {
            background: "#000",
        }, children: [_jsx(Sequence, { from: 0, durationInFrames: rowDuration, children: _jsxs(AbsoluteFill, { children: [_jsx(Sequence, { from: 0, durationInFrames: 90, children: _jsxs("div", { style: {
                                    position: "absolute",
                                    top: "0%",
                                    left: 0,
                                    width: "100%",
                                    height: "80%",
                                }, children: [_jsx(RowImage, { image: img1 }), _jsx("div", { style: {
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            zIndex: 10,
                                            color: "#fff",
                                            fontSize: 72,
                                            fontWeight: 900,
                                            letterSpacing: 12,
                                            textTransform: "uppercase",
                                            textShadow: "0 0 10px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.4), 0 8px 25px rgba(0,0,0,.9)",
                                        }, children: "Camera" })] }) }), _jsx(Sequence, { from: 30, durationInFrames: 60, children: _jsxs("div", { style: {
                                    position: "absolute",
                                    top: "34%",
                                    left: 0,
                                    width: "100%",
                                    height: "80%",
                                }, children: [_jsx(RowImage, { image: img2 }), _jsx("div", { style: {
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            zIndex: 10,
                                            color: "#fff",
                                            fontSize: 72,
                                            fontWeight: 900,
                                            letterSpacing: 12,
                                            textTransform: "uppercase",
                                            textShadow: "0 0 10px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.4), 0 8px 25px rgba(0,0,0,.9)",
                                        }, children: "Rolling" })] }) }), _jsx(Sequence, { from: 60, durationInFrames: 30, children: _jsxs("div", { style: {
                                    position: "absolute",
                                    top: "68%",
                                    left: 0,
                                    width: "100%",
                                    height: "80%",
                                }, children: [_jsx(RowImage, { image: img3 }), _jsx("div", { style: {
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            zIndex: 10,
                                            color: "#fff",
                                            fontSize: 72,
                                            fontWeight: 900,
                                            letterSpacing: 12,
                                            textTransform: "uppercase",
                                            textShadow: "0 0 10px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.4), 0 8px 25px rgba(0,0,0,.9)",
                                        }, children: "Action" })] }) })] }) }), _jsx(Sequence, { from: rowDuration, durationInFrames: fastDuration, children: _jsx(AbsoluteFill, { children: [img4, img5, img6, img7, img8, img16].map((img, index) => (_jsx(Sequence, { from: index * 9, durationInFrames: 9, children: _jsx(AnimatedImage, { src: img?.path ?? "", animation: "zoomIn", durationInFrames: 9, style: {
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            } }) }, index))) }) }), _jsx(Sequence, { from: rowDuration + fastDuration, durationInFrames: CardDuration, children: _jsxs(AbsoluteFill, { children: [_jsx(Sequence, { from: 0, durationInFrames: 30, children: _jsx("div", { style: {
                                    position: "absolute",
                                    left: 80,
                                    top: 100,
                                }, children: _jsx(CardImage, { image: img9, delay: 0 }) }) }), _jsx(Sequence, { from: 8, durationInFrames: 30, children: _jsx("div", { style: {
                                    position: "absolute",
                                    right: 80,
                                    top: 150,
                                }, children: _jsx(CardImage, { image: img10, delay: 8 }) }) }), _jsx(Sequence, { from: 16, durationInFrames: 30, children: _jsx("div", { style: {
                                    position: "absolute",
                                    left: 150,
                                    top: 450,
                                }, children: _jsx(CardImage, { image: img11, delay: 16 }) }) }), _jsx(Sequence, { from: 24, durationInFrames: 30, children: _jsx("div", { style: {
                                    position: "absolute",
                                    right: 150,
                                    top: 500,
                                }, children: _jsx(CardImage, { image: img12, delay: 24 }) }) }), _jsx(Sequence, { from: 32, durationInFrames: 30, children: _jsx("div", { style: {
                                    position: "absolute",
                                    left: 400,
                                    top: 250,
                                }, children: _jsx(CardImage, { image: img13, delay: 32 }) }) }), _jsx(Sequence, { from: 40, durationInFrames: 30, children: _jsx("div", { style: {
                                    position: "absolute",
                                    right: 400,
                                    bottom: 100,
                                }, children: _jsx(CardImage, { image: img14, delay: 40 }) }) }), _jsx(Sequence, { from: 40, durationInFrames: 30, children: _jsx("div", { style: {
                                    position: "absolute",
                                    right: 400,
                                    bottom: 100,
                                }, children: _jsx(CardImage, { image: img15, delay: 40 }) }) })] }) }), _jsx(Sequence, { from: rowDuration + fastDuration + CardDuration, durationInFrames: gridDuration, children: _jsx(PremiumGrid, { images: gridImages, slideDuration: gridDuration / fps, music: undefined, transition: "glide", effect: "cinematic", showCounter: true }) })] }));
};
export default WeddingSequenceComposition;
