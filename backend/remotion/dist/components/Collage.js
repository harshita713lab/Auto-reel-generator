import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, } from "remotion";
import AnimatedImage from "./AnimatedImage";
const Collage = ({ images, animation = "kenBurns", }) => {
    const frame = useCurrentFrame();
    return (_jsxs(AbsoluteFill, { children: [_jsx(AnimatedImage, { src: images[0], animation: "kenBurns", durationInFrames: 90, style: {
                    filter: "blur(35px) brightness(0.6)",
                    transform: "scale(1.2)",
                } }), _jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 20,
                }, children: images.slice(0, 4).map((img, index) => {
                    const delay = index * 10;
                    const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });
                    const scale = interpolate(frame, [delay, delay + 10], [0.8, 1], {
                        easing: Easing.out(Easing.ease),
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });
                    return (_jsx("div", { style: {
                            width: 260,
                            height: 140,
                            background: "#fff",
                            padding: 8,
                            borderRadius: 18,
                            overflow: "hidden",
                            boxShadow: "0 15px 35px rgba(0,0,0,.25)",
                            opacity,
                            transform: `scale(${scale})`,
                        }, children: _jsx(AnimatedImage, { src: img, animation: animation, durationInFrames: 90, style: {
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            } }) }, index));
                }) })] }));
};
export default Collage;
