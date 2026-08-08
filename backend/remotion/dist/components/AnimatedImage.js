import { jsx as _jsx } from "react/jsx-runtime";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, Easing, } from "remotion";
const AnimatedImage = ({ src, animation = "kenBurns", durationInFrames = 18, style, startFrame = 0, }) => {
    const globalFrame = useCurrentFrame();
    const frame = Math.max(0, globalFrame - startFrame);
    const end = durationInFrames;
    let scale = 1;
    let x = 0;
    let y = 0;
    let rotate = 0;
    switch (animation) {
        case "kenBurns":
            scale = interpolate(frame, [0, end], [1, 1.08], {
                easing: Easing.ease,
                extrapolateRight: "clamp",
            });
            break;
        case "zoomIn":
            scale = interpolate(frame, [0, end], [1, 1.12], {
                easing: Easing.ease,
                extrapolateRight: "clamp",
            });
            break;
        case "slideLeft":
            x = interpolate(frame, [0, end], [100, 0], {
                easing: Easing.ease,
                extrapolateRight: "clamp",
            });
            break;
        case "slideRight":
            x = interpolate(frame, [0, end], [-100, 0], {
                easing: Easing.ease,
                extrapolateRight: "clamp",
            });
            break;
        case "zoomOut":
            scale = interpolate(frame, [0, end], [1.08, 1], {
                easing: Easing.ease,
                extrapolateRight: "clamp",
            });
            break;
        case "panLeft":
            x = interpolate(frame, [0, end], [0, -20], {
                extrapolateRight: "clamp",
            });
            break;
        case "panRight":
            x = interpolate(frame, [0, end], [0, 20], {
                extrapolateRight: "clamp",
            });
            break;
        case "panUp":
            y = interpolate(frame, [0, end], [0, -15], {
                extrapolateRight: "clamp",
            });
            break;
        case "panDown":
            y = interpolate(frame, [0, end], [0, 15], {
                extrapolateRight: "clamp",
            });
            break;
        case "rotate":
            rotate = interpolate(frame, [0, end], [-1, 1], {
                extrapolateRight: "clamp",
            });
            break;
        default:
            scale = interpolate(frame, [0, end], [1, 1.08], {
                easing: Easing.ease,
                extrapolateRight: "clamp",
            });
    }
    // Beat Micro-Zoom Effect (1.05x pulse during the first 6 frames of a scene transition)
    const beatPulse = interpolate(frame, [0, 3, 6], [1.05, 1.02, 1], {
        extrapolateRight: "clamp",
    });
    const finalScale = scale * beatPulse;
    return (_jsx(AbsoluteFill, { style: {
            overflow: "hidden",
        }, children: _jsx(Img, { src: src, style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `
            translate(${x}px, ${y}px)
            scale(${finalScale})
            rotate(${rotate}deg)
          `,
                willChange: "transform",
                ...style,
            }, onError: () => console.log("Image Error", src) }) }));
};
export default AnimatedImage;
