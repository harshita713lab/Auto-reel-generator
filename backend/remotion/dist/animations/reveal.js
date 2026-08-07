import { Easing } from 'remotion';
export const reveal = ({ progress, direction = 'center' }) => {
    const opacity = progress;
    const scale = 0.8 + 0.2 * progress;
    let translateX = 0;
    let translateY = 0;
    switch (direction) {
        case 'left':
            translateX = -(1 - progress) * 50;
            break;
        case 'right':
            translateX = (1 - progress) * 50;
            break;
        case 'up':
            translateY = -(1 - progress) * 50;
            break;
        case 'down':
            translateY = (1 - progress) * 50;
            break;
        default:
            break;
    }
    return {
        opacity,
        scale,
        translateX,
        translateY,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const revealLeft = ({ progress }) => {
    const x = -(1 - progress) * 60;
    const opacity = progress;
    return {
        translateX: x,
        opacity,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
export const revealRight = ({ progress }) => {
    const x = (1 - progress) * 60;
    const opacity = progress;
    return {
        translateX: x,
        opacity,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
    };
};
