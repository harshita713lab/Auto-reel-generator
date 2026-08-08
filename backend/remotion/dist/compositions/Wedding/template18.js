import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, Img, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig, } from "remotion";
// =====================================
// FLOATING CARD
// =====================================
const FloatingCard = ({ image, index, position }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    // har image ka alag delay
    const delay = index * 10;
    const progress = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 14,
            stiffness: 90,
            mass: 0.8
        }
    });
    const startPositions = [
        { x: -300, y: 0 },
        { x: 0, y: -300 },
        { x: 300, y: 0 },
        { x: -300, y: 300 },
        { x: 300, y: 300 },
        { x: -350, y: 200 },
        { x: 0, y: 400 },
        { x: 350, y: 200 }
    ];
    const translateX = interpolate(progress, [0, 1], [startPositions[index].x, 0]);
    const translateY = interpolate(progress, [0, 1], [startPositions[index].y, 0]);
    const rotate = interpolate(progress, [0, 1], [
        index % 2 === 0 ? -20 : 20,
        0
    ]);
    const scale = interpolate(progress, [0, 1], [
        0.4,
        1
    ]);
    const opacity = interpolate(progress, [0, 1], [0, 1]);
    return (_jsx("div", { style: {
            position: "absolute",
            left: position.left,
            top: position.top,
            width: position.width,
            height: position.height,
            border: "8px solid black",
            opacity,
            transform: `
translate(${translateX}px,${translateY}px)
scale(${scale})
rotate(${rotate}deg)
`,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,.5)"
        }, children: _jsx(Img, { src: image.path, style: {
                width: "100%",
                height: "100%",
                objectFit: "cover"
            } }) }));
};
// =====================================
// SCENE 1 : FLOATING MEMORY WALL
// 0 - 3 SEC
// =====================================
const FloatingMemoryWall = ({ images = [] }) => {
    const cardsPosition = [
        {
            left: 20,
            top: 180,
            width: 330,
            height: 450
        },
        {
            left: 375,
            top: 80,
            width: 330,
            height: 430
        },
        {
            left: 730,
            top: 180,
            width: 330,
            height: 450
        },
        {
            left: 180,
            top: 600,
            width: 330,
            height: 450
        },
        {
            left: 560,
            top: 560,
            width: 330,
            height: 430
        },
        {
            left: 20,
            top: 1050,
            width: 330,
            height: 450
        },
        {
            left: 375,
            top: 980,
            width: 330,
            height: 430
        },
        {
            left: 730,
            top: 1050,
            width: 330,
            height: 450
        }
    ];
    // =====================================
    // SCENE 2 : FILM STRIP TRANSITION
    // 3 - 8 SEC
    // =====================================
    return (_jsx(AbsoluteFill, { style: {
            background: "#f8f5f0"
        }, children: images.slice(0, 8).map((img, index) => (_jsx(FloatingCard, { image: img, index: index, position: cardsPosition[index] }, index))) }));
};
const FilmStrip = ({ images = [] }) => {
    const frame = useCurrentFrame();
    // horizontal movement
    const translateX = interpolate(frame, [0, 150], [300, -1200], {
        extrapolateRight: "clamp"
    });
    return (_jsxs(AbsoluteFill, { style: {
            background: "#f8f5f0",
            justifyContent: "center",
            overflow: "hidden"
        }, children: [_jsx("div", { style: {
                    position: "absolute",
                    top: 100,
                    width: "100%",
                    textAlign: "center",
                    zIndex: 10,
                    color: "#3a2b22",
                }, children: _jsx("div", { style: {
                        fontSize: 30,
                        letterSpacing: 10,
                        fontFamily: "serif",
                        opacity: 0.7
                    }, children: "OUR JOURNEY" }) }), _jsx("div", { style: {
                    display: "flex",
                    gap: 40,
                    alignItems: "center",
                    transform: `translateX(${translateX}px)`
                }, children: images.slice(8, 13).map((img, index) => (_jsx(FilmCard, { image: img, index: index }, index))) })] }));
};
// =================================
// FILM CARD WITH ZOOM
// =================================
const FilmCard = ({ image, index }) => {
    const frame = useCurrentFrame();
    const zoom = interpolate(frame, [0, 150], [1, 1.15], {
        extrapolateRight: "clamp"
    });
    const opacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp"
    });
    return (_jsxs("div", { style: {
            width: 800,
            height: 1300,
            borderRadius: 45,
            overflow: "hidden",
            flexShrink: 0,
            position: "relative",
            opacity,
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)"
        }, children: [_jsx(Img, { src: image.path, style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${zoom})`
                } }), _jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top,rgba(0,0,0,.45),transparent 60%)"
                } })] }));
};
// =====================================
// SCENE 3 : CINEMATIC HERO PHOTOS
// 8 - 17 SEC
// =====================================
const HeroPhoto = ({ image }) => {
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, 90], [1.15, 1], {
        extrapolateRight: "clamp"
    });
    // circle reveal
    const circleSize = interpolate(frame, [0, 25], [0, 150], {
        extrapolateRight: "clamp"
    });
    const opacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp"
    });
    return (_jsxs(AbsoluteFill, { style: {
            background: "#000",
            overflow: "hidden"
        }, children: [_jsx(Img, { src: image.path, style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale})`,
                    opacity,
                    clipPath: `circle(${circleSize}% at 50% 50%)`
                } }), _jsx(AbsoluteFill, { style: {
                    background: "radial-gradient(circle,transparent 30%,rgba(255,255,255,0.15))"
                } })] }));
};
const HeroSequence = ({ images = [] }) => {
    const duration = 90; // 3 sec each photo
    return (_jsx(AbsoluteFill, { children: images.slice(15, 18).map((img, index) => (_jsx(Sequence, { from: index * duration, durationInFrames: duration, children: _jsx(HeroPhoto, { image: img }) }, index))) }));
};
// =====================================
// SCENE 4 : FINAL HERO ENDING
// 17 - 22 SEC
// =====================================
// MAIN COMPOSITION
// =====================================
export const MemoryJourneyWeddingReel = ({ images = [], namesText = "JULIAN & JULI" }) => {
    return (_jsxs(AbsoluteFill, { children: [_jsx(Sequence, { from: 0, durationInFrames: 90, children: _jsx(FloatingMemoryWall, { images: images }) }), _jsx(Sequence, { from: 90, durationInFrames: 150, children: _jsx(FilmStrip, { images: images }) }), _jsx(Sequence, { from: 240, durationInFrames: 270, children: _jsx(HeroSequence, { images: images }) })] }));
};
