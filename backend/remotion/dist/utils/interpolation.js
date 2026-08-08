/**
 * Linear interpolation between two values
 */
export const lerp = (a, b, t) => {
    return a + (b - a) * t;
};
/**
 * Interpolate between two colors (hex)
 */
export const lerpColor = (color1, color2, t) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const r = Math.round(lerp(rgb1.r, rgb2.r, t));
    const g = Math.round(lerp(rgb1.g, rgb2.g, t));
    const b = Math.round(lerp(rgb1.b, rgb2.b, t));
    return rgbToHex({ r, g, b });
};
// Need to import hexToRgb and rgbToHex
import { hexToRgb, rgbToHex } from './colors';
/**
 * Interpolate between multiple values
 */
export const interpolateArray = (values, t) => {
    if (values.length === 0)
        return 0;
    if (values.length === 1)
        return values[0];
    const segment = (values.length - 1) * t;
    const index = Math.floor(segment);
    const fraction = segment - index;
    if (index >= values.length - 1)
        return values[values.length - 1];
    return lerp(values[index], values[index + 1], fraction);
};
export const interpolatePoints = (points, t) => {
    if (points.length === 0)
        return { x: 0, y: 0 };
    if (points.length === 1)
        return points[0];
    const segment = (points.length - 1) * t;
    const index = Math.floor(segment);
    const fraction = segment - index;
    if (index >= points.length - 1)
        return points[points.length - 1];
    return {
        x: lerp(points[index].x, points[index + 1].x, fraction),
        y: lerp(points[index].y, points[index + 1].y, fraction),
    };
};
/**
 * Smooth step interpolation (Hermite)
 */
export const smoothstep = (edge0, edge1, t) => {
    const x = clamp((t - edge0) / (edge1 - edge0), 0, 1);
    return x * x * (3 - 2 * x);
};
// Need to import clamp
import { clamp } from './helpers';
/**
 * Interpolate with easing
 */
export const interpolateEased = (t, from, to, easingFn) => {
    const eased = easingFn(clamp(t, 0, 1));
    return lerp(from, to, eased);
};
/**
 * Interpolate with spring physics
 */
export const springInterpolate = (t, from, to, stiffness = 100, damping = 10) => {
    // Simplified spring physics
    const dt = 0.01;
    let velocity = 0;
    let position = from;
    const target = to;
    const mass = 1;
    for (let i = 0; i < t * 100; i++) {
        const force = -stiffness * (position - target);
        const dampingForce = -damping * velocity;
        const acceleration = (force + dampingForce) / mass;
        velocity += acceleration * dt;
        position += velocity * dt;
    }
    return position;
};
/**
 * Interpolate with overshoot
 */
export const interpolateOvershoot = (t, from, to, overshoot = 0.2) => {
    const progress = clamp(t, 0, 1);
    const overshootAmount = overshoot * (to - from);
    if (progress < 1) {
        return lerp(from, to + overshootAmount, progress);
    }
    else {
        return lerp(to + overshootAmount, to, (progress - 1) / 0.1);
    }
};
/**
 * Interpolation types
 */
export const interpolateTypes = {
    linear: lerp,
    smoothstep: (a, b, t) => {
        const x = clamp(t, 0, 1);
        const s = x * x * (3 - 2 * x);
        return lerp(a, b, s);
    },
    easeIn: (a, b, t) => {
        const x = clamp(t, 0, 1);
        return lerp(a, b, x * x);
    },
    easeOut: (a, b, t) => {
        const x = clamp(t, 0, 1);
        return lerp(a, b, 1 - (1 - x) * (1 - x));
    },
    easeInOut: (a, b, t) => {
        const x = clamp(t, 0, 1);
        const s = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
        return lerp(a, b, s);
    },
};
