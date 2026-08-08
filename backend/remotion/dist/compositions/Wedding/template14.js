import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame, } from "remotion";
export const RoyalWeddingStory = ({ images = [], music, }) => {
    // ==========================
    // IMAGE DISTRIBUTION (17 IMAGES)
    // ==========================
    const heroImg = images[0];
    const gridImgs = images.slice(1, 5);
    const splitImgs = images.slice(5, 10);
    const masonryImgs = images.slice(10, 14);
    // ==========================
    // 15 SECOND TIMELINE
    // ==========================
    const heroDuration = 60;
    const gridDuration = 60;
    const splitDuration = 60;
    const masonryDuration = 120;
    const endingDuration = 45;
    const totalDuration = heroDuration +
        gridDuration +
        splitDuration +
        masonryDuration +
        endingDuration;
    // =====================================
    // HERO IMAGE
    // =====================================
    const HeroImage = ({ image, }) => {
        const frame = useCurrentFrame();
        const scale = interpolate(frame, [0, 60], [1.15, 1], {
            extrapolateRight: "clamp",
        });
        const opacity = interpolate(frame, [0, 15], [0, 1], {
            extrapolateRight: "clamp",
        });
        return (_jsxs(AbsoluteFill, { style: {
                overflow: "hidden",
                background: "#000",
            }, children: [_jsx(Img, { src: image?.path ?? "", style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: `scale(${scale})`,
                        opacity,
                    } }), _jsx(AbsoluteFill, { style: {
                        background: "linear-gradient(to top, rgba(0,0,0,.55), transparent 60%)",
                    } }), _jsxs("div", { style: {
                        position: "absolute",
                        bottom: 140,
                        width: "100%",
                        textAlign: "center",
                        color: "#fff",
                    }, children: [_jsx("div", { style: {
                                fontSize: 26,
                                letterSpacing: 10,
                                fontFamily: "serif",
                            }, children: "WEDDING FILM" }), _jsx("div", { style: {
                                marginTop: 12,
                                fontSize: 58,
                                fontWeight: 700,
                                letterSpacing: 6,
                            }, children: "FOREVER" })] })] }));
    };
    // =====================================
    // DYNAMIC GRID
    // =====================================
    const DynamicGrid = ({ images, }) => {
        const frame = useCurrentFrame();
        return (_jsx(AbsoluteFill, { style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                padding: 8,
                background: "#111",
            }, children: images.map((img, index) => {
                const delay = index * 6;
                const scale = interpolate(frame - delay, [0, 18], [0.6, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                });
                return (_jsx("div", { style: {
                        overflow: "hidden",
                        borderRadius: 20,
                        transform: `scale(${scale})`,
                        boxShadow: "0 10px 25px rgba(0,0,0,.45)",
                    }, children: _jsx(Img, { src: img.path, style: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        } }) }, index));
            }) }));
    };
    // =====================================
    // SPLIT SCREEN
    // =====================================
    const SplitScreen = ({ images, }) => {
        const frame = useCurrentFrame();
        const positions = [
            { left: 360, top: 40 }, // Image 1 (Center)
            { left: 80, top: 420 }, // Image 2 (Left)
            { left: 640, top: 800 }, // Image 3 (Right)
            { left: 80, top: 1180 }, // Image 4 (Left)
            { left: 640, top: 1540 },
        ];
        return (_jsx(AbsoluteFill, { style: {
                background: "#faf8f5",
                position: "relative",
            }, children: images.map((img, index) => {
                const startX = index === 0
                    ? 0
                    : index === 1
                        ? -500
                        : index === 2
                            ? 500
                            : -500;
                const translateX = interpolate(frame, [index * 8, index * 8 + 20], [startX, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                });
                const scale = interpolate(frame, [index * 8, index * 8 + 20], [1.15, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                });
                return (_jsx("div", { style: {
                        position: "absolute",
                        left: positions[index].left,
                        top: positions[index].top,
                        width: 420,
                        height: 300,
                        overflow: "hidden",
                        borderRadius: 22,
                        transform: `translateX(${translateX}px) scale(${scale})`,
                        boxShadow: "0 12px 30px rgba(0,0,0,.45)",
                    }, children: _jsx(Img, { src: img.path, style: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transform: "scale(1.15)",
                        } }) }, index));
            }) }));
    };
    // =====================================
    // PREMIUM MASONRY
    // =====================================
    const MasonryGrid = ({ images, }) => {
        return (_jsx(AbsoluteFill, { style: {
                padding: 12,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: 10,
                background: "#faf8f5",
                position: "relative",
            }, children: images.map((img, i) => (_jsx("div", { style: {
                    gridColumn: i === 4 ? "1 / span 3" : undefined,
                    overflow: "hidden",
                    borderRadius: 18,
                }, children: _jsx(Img, { src: img.path, style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    } }) }, i))) }));
    };
    // =====================================
    // DUAL CARD FLIP
    // =====================================
    // =====================================
    // ENDING SCENE
    // =====================================
    const EndingScene = () => {
        const frame = useCurrentFrame();
        const opacity = interpolate(frame, [0, 20], [0, 1]);
        return (_jsx(AbsoluteFill, { style: {
                background: "#000",
                justifyContent: "center",
                alignItems: "center"
            }, children: _jsxs("div", { style: {
                    textAlign: "center",
                    color: "#fff",
                    opacity
                }, children: [_jsx("div", { style: {
                            fontSize: 34,
                            letterSpacing: 8,
                            fontFamily: "serif"
                        }, children: "THANK YOU" }), _jsx("div", { style: {
                            marginTop: 15,
                            fontSize: 60,
                            fontWeight: 700
                        }, children: "Forever Begins" })] }) }));
    };
    return (_jsxs(AbsoluteFill, { style: { background: "#000" }, children: [_jsx(Sequence, { from: 0, durationInFrames: heroDuration, children: _jsx(HeroImage, { image: heroImg }) }), _jsx(Sequence, { from: heroDuration, durationInFrames: gridDuration, children: _jsx(DynamicGrid, { images: gridImgs }) }), _jsx(Sequence, { from: heroDuration + gridDuration, durationInFrames: splitDuration, children: _jsx(SplitScreen, { images: splitImgs }) }), _jsx(Sequence, { from: heroDuration +
                    gridDuration +
                    splitDuration, durationInFrames: masonryDuration, children: _jsx(MasonryGrid, { images: masonryImgs }) }), _jsx(Sequence, { from: heroDuration +
                    gridDuration +
                    splitDuration +
                    masonryDuration, durationInFrames: endingDuration, children: _jsx(EndingScene, {}) }), music?.path && (_jsx("audio", { src: music.path, autoPlay: true }))] }));
};
