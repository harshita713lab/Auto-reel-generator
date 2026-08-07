import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, } from "remotion";
import { AnimatedImage } from "../../components";
import { getBeatScale } from "../../utils/beatUtils";
const WeddingSplitSlider = ({ images = [], music, beatTimestamps = [], }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const beatScale = getBeatScale(frame, fps, beatTimestamps);
    const totalDuration = 450;
    // ----------------------------
    // Image Mapping (11 Images)
    // ----------------------------
    const bgImage = images[0];
    const leftTop = images[1];
    const leftBottom = images[2];
    const sliderImages = images.slice(3, 11);
    // ----------------------------
    // Background
    // ----------------------------
    const Background = () => {
        if (!bgImage)
            return null;
        return (_jsx(AnimatedImage, { src: bgImage.path, animation: "kenBurns", durationInFrames: totalDuration, style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(6px) brightness(1.1) saturate(1.1)",
                transform: "scale(1.03)",
                opacity: 0.9,
            } }));
    };
    // ----------------------------
    // Polaroid Card
    // ----------------------------
    const PolaroidCard = ({ image, rotate, width, height, }) => {
        if (!image)
            return null;
        const scale = interpolate(frame, [0, totalDuration], [1, 1.05]);
        // ==========================
        // Left Fixed Cards
        // ==========================
        // ==========================
        // Slider Card
        // ==========================
        return (_jsx("div", { style: {
                width,
                height,
                background: "#fff",
                padding: 12,
                borderRadius: 18,
                boxShadow: "0 20px 50px rgba(0,0,0,.35)",
                transform: `scale(${scale})`
            }, children: _jsx(Img, { src: image.path, style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 12,
                } }) }));
    };
    const SliderCard = ({ image, index, }) => {
        if (!image)
            return null;
        return (_jsx("div", { style: {
                width: 330,
                height: 420,
                background: "#fff",
                padding: 10,
                borderRadius: 16,
                marginBottom: 24,
                marginLeft: 15,
                transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                boxShadow: "0 15px 35px rgba(0,0,0,.35)",
            }, children: _jsx(Img, { src: image.path, style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 10,
                } }) }));
    };
    const RightSlider = () => {
        const cards = [
            ...sliderImages,
            ...sliderImages,
            ...sliderImages,
        ];
        const cardHeight = 344;
        const trackHeight = sliderImages.length * cardHeight;
        const scrollDuration = 300;
        const translate = (frame / scrollDuration) * trackHeight;
        return (_jsx("div", { style: {
                position: "absolute",
                right: 70,
                top: 0,
                bottom: 0,
                width: 360,
                overflow: "hidden",
                zIndex: 10,
            }, children: _jsx("div", { style: {
                    position: "absolute",
                    width: "100%",
                    transform: `translateY(${250 - translate}px)`,
                }, children: cards.map((img, index) => (_jsx(SliderCard, { image: img, index: index }, index))) }) }));
    };
    const LeftCards = () => {
        return (_jsxs(_Fragment, { children: [_jsx("div", { style: {
                        position: "absolute",
                        left: 20,
                        top: 60,
                        zIndex: 5,
                    }, children: _jsx(PolaroidCard, { image: leftTop, rotate: -5, width: 460, height: 900 }) }), _jsx("div", { style: {
                        position: "absolute",
                        left: 120,
                        bottom: 120,
                        zIndex: 5,
                    }, children: _jsx(PolaroidCard, { image: leftBottom, rotate: 5, width: 460, height: 900 }) })] }));
    };
    return (_jsxs(AbsoluteFill, { style: {
            backgroundColor: "#000",
            overflow: "hidden",
            transform: `scale(${beatScale})`,
        }, children: [_jsx(Background, {}), _jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.25)",
                } }), _jsx(LeftCards, {}), _jsx(RightSlider, {})] }));
};
export default WeddingSplitSlider;
