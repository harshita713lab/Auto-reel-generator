/**
 * Clamp a value between min and max
 */
export const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
};
/**
 * Random number between min and max
 */
export const random = (min = 0, max = 1) => {
    return Math.random() * (max - min) + min;
};
/**
 * Random integer between min and max (inclusive)
 */
export const randomInt = (min, max) => {
    return Math.floor(random(min, max + 1));
};
/**
 * Shuffle array
 */
export const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
/**
 * Pick random item from array
 */
export const randomPick = (array) => {
    return array[randomInt(0, array.length - 1)];
};
/**
 * Format duration (seconds) to MM:SS
 */
export const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
    if (bytes < 1024)
        return bytes + ' B';
    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024)
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};
/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};
/**
 * Throttle function
 */
export const throttle = (fn, limit) => {
    let inThrottle = false;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};
/**
 * Deep clone object
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
/**
 * Merge objects deeply
 */
export const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge((result[key] || {}), source[key]);
        }
        else {
            result[key] = source[key];
        }
    }
    return result;
};
/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return value.trim() === '';
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
};
/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
    return filename.split('.').pop()?.toLowerCase() || '';
};
/**
 * Generate unique ID
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};
/**
 * Convert frames to time (seconds)
 */
export const framesToTime = (frames, fps) => {
    return frames / fps;
};
/**
 * Convert time (seconds) to frames
 */
export const timeToFrames = (time, fps) => {
    return Math.round(time * fps);
};
/**
 * Get aspect ratio string
 */
export const getAspectRatio = (width, height) => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const g = gcd(width, height);
    return `${width / g}:${height / g}`;
};
/**
 * Check if value is a valid number
 */
export const isValidNumber = (value) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
};
/**
 * Round to decimal places
 */
export const roundTo = (value, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
};
