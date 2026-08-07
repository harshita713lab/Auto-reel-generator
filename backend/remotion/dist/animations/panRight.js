import { Easing } from 'remotion';
export const panRight = ({ progress, distance = 100 }) => {
    const x = progress * distance;
    return {
        translateX: x,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const panRightIn = ({ progress, distance = 80 }) => {
    const x = (1 - progress) * distance;
    const opacity = progress;
    return {
        translateX: x,
        opacity,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const panRightOut = ({ progress, distance = 80 }) => {
    const x = progress * distance;
    const opacity = 1 - progress;
    return {
        translateX: x,
        opacity,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
