import { Easing } from 'remotion';
export const shake = ({ progress, intensity = 5, frequency = 10 }) => {
    const shakeX = (Math.random() - 0.5) * intensity * (1 - progress);
    const shakeY = (Math.random() - 0.5) * intensity * (1 - progress);
    const shakeR = (Math.random() - 0.5) * intensity * 0.5 * (1 - progress);
    return {
        translateX: shakeX,
        translateY: shakeY,
        rotate: shakeR,
        easing: Easing.linear,
    };
};
export const shakeHorizontal = ({ progress, intensity = 8, frequency = 8 }) => {
    const shakeX = Math.sin(progress * Math.PI * 2 * frequency) * intensity * (1 - progress);
    return {
        translateX: shakeX,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const shakeVertical = ({ progress, intensity = 8, frequency = 8 }) => {
    const shakeY = Math.sin(progress * Math.PI * 2 * frequency) * intensity * (1 - progress);
    return {
        translateY: shakeY,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
