import { Easing } from 'remotion';
export const float = ({ progress, amplitude = 10, frequency = 1 }) => {
    const y = Math.sin(progress * Math.PI * 2 * frequency) * amplitude;
    return {
        translateY: y,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const floatIn = ({ progress, amplitude = 20, frequency = 0.5 }) => {
    const y = (1 - progress) * amplitude + Math.sin(progress * Math.PI * 2 * frequency) * amplitude * 0.5;
    const opacity = progress;
    return {
        translateY: y,
        opacity,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const floatOut = ({ progress, amplitude = 20, frequency = 0.5 }) => {
    const y = progress * amplitude + Math.sin((1 - progress) * Math.PI * 2 * frequency) * amplitude * 0.5;
    const opacity = 1 - progress;
    return {
        translateY: y,
        opacity,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
