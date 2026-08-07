import { Easing } from 'remotion';
export const zoomOut = ({ progress, startScale = 1.5, endScale = 1 }) => {
    const scale = startScale - (startScale - endScale) * progress;
    const opacity = 1 - progress * 0.5;
    return {
        scale,
        opacity,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const zoomOutSlow = ({ progress, startScale = 1.3, endScale = 1 }) => {
    const scale = startScale - (startScale - endScale) * progress;
    const x = Math.sin((1 - progress) * Math.PI * 0.5) * 5;
    const y = Math.cos((1 - progress) * Math.PI * 0.5) * 5;
    return {
        scale,
        translateX: x,
        translateY: y,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const zoomOutFast = ({ progress, startScale = 1.5, endScale = 0.8 }) => {
    const scale = startScale - (startScale - endScale) * progress;
    const blur = progress * 5;
    return {
        scale,
        blur,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
