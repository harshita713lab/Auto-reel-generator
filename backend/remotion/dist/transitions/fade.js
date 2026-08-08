import { jsx as _jsx } from "react/jsx-runtime";
import { useCurrentFrame, interpolate, Easing } from 'remotion';
export const FadeTransition = ({ children, durationInFrames = 30, direction = 'both', delay = 0, }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
    const eased = Easing.inOut(Easing.ease)(progress);
    let opacity = 1;
    if (direction === 'in') {
        opacity = interpolate(eased, [0, 1], [0, 1]);
    }
    else if (direction === 'out') {
        opacity = interpolate(eased, [0, 1], [1, 0]);
    }
    else {
        // Both - fade in then out
        if (eased <= 0.5) {
            opacity = interpolate(eased / 0.5, [0, 1], [0, 1]);
        }
        else {
            opacity = interpolate((eased - 0.5) / 0.5, [0, 1], [1, 0]);
        }
    }
    return (_jsx("div", { style: {
            width: '100%',
            height: '100%',
            opacity,
            transition: 'opacity 0.05s ease-out',
        }, children: children }));
};
