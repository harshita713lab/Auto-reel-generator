import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCurrentFrame, interpolate } from 'remotion';
export const AnimatedText = ({ text, durationInFrames, animation = 'fade', delay = 0, className = '', style = {}, fontSize = 48, color = '#FFFFFF', fontFamily = 'Arial, sans-serif', }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, Math.min((frame - delay) / durationInFrames, 1));
    const getStyle = () => {
        switch (animation) {
            case 'fade':
                return {
                    opacity: interpolate(progress, [0, 0.3], [0, 1]),
                    transform: 'none',
                };
            case 'slide':
                return {
                    opacity: interpolate(progress, [0, 0.3], [0, 1]),
                    transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
                };
            case 'scale':
                return {
                    opacity: interpolate(progress, [0, 0.3], [0, 1]),
                    transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
                };
            case 'typewriter': {
                const count = Math.floor(progress * text.length);
                return {
                    opacity: 1,
                    transform: 'none',
                    displayText: text.slice(0, count),
                    cursor: count < text.length ? '|' : '',
                };
            }
            case 'bounce':
                return {
                    opacity: interpolate(progress, [0, 0.2], [0, 1]),
                    transform: `translateY(${Math.sin(progress * Math.PI * 3) * 20 * (1 - progress)}px)`,
                };
            default:
                return { opacity: 1, transform: 'none' };
        }
    };
    const anim = getStyle();
    const displayText = animation === 'typewriter' ? anim.displayText : text;
    const cursor = animation === 'typewriter' ? anim.cursor : '';
    return (_jsxs("div", { className: className, style: {
            fontSize,
            color,
            fontFamily,
            fontWeight: 'bold',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            textAlign: 'center',
            padding: '20px',
            lineHeight: 1.2,
            ...style,
            opacity: anim.opacity,
            transform: anim.transform,
        }, children: [displayText, cursor && (_jsx("span", { style: { opacity: Math.sin(frame * 0.1) > 0 ? 1 : 0 }, children: cursor }))] }));
};
