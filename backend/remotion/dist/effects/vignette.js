import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCurrentFrame } from 'remotion';
export const Vignette = ({ intensity = 0.5, radius = 0.8, color = '#000000', opacity = 1, animated = true, children, }) => {
    const frame = useCurrentFrame();
    const pulse = animated
        ? 0.9 + Math.sin(frame * 0.01) * 0.1
        : 1;
    const currentIntensity = intensity * pulse;
    const currentRadius = radius * (0.9 + Math.sin(frame * 0.008) * 0.1);
    const gradientStops = [
        `rgba(0,0,0,0) ${currentRadius * 100}%`,
        `${color} ${currentRadius * 100 + 10}%`,
        `${color} 100%`,
    ];
    return (_jsxs("div", { style: {
            position: 'relative',
            width: '100%',
            height: '100%',
        }, children: [_jsx("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(ellipse at center, ${gradientStops.join(', ')})`,
                    opacity: opacity * currentIntensity,
                    pointerEvents: 'none',
                    transition: animated ? 'all 0.05s ease' : 'none',
                    mixBlendMode: 'multiply',
                } }), _jsx("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    boxShadow: `inset 0 0 ${100 * currentIntensity}px ${50 * currentIntensity}px rgba(0,0,0,${0.3 * currentIntensity})`,
                    pointerEvents: 'none',
                } }), children] }));
};
