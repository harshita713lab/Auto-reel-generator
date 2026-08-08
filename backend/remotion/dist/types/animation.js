export const AnimationDefaults = {
    zoomIn: {
        defaultDuration: 1.5,
        defaultParams: { startScale: 0.5, endScale: 1 },
        description: 'Zoom in from center',
    },
    zoomOut: {
        defaultDuration: 1.5,
        defaultParams: { startScale: 1.5, endScale: 1 },
        description: 'Zoom out from center',
    },
    kenBurns: {
        defaultDuration: 3,
        defaultParams: { startScale: 1.1, endScale: 1.4, startX: 0, startY: 0, endX: 10, endY: 10 },
        description: 'Ken Burns pan and zoom effect',
    },
    panLeft: {
        defaultDuration: 2,
        defaultParams: { distance: 100 },
        description: 'Pan left across image',
    },
    panRight: {
        defaultDuration: 2,
        defaultParams: { distance: 100 },
        description: 'Pan right across image',
    },
    panUp: {
        defaultDuration: 2,
        defaultParams: { distance: 100 },
        description: 'Pan up across image',
    },
    panDown: {
        defaultDuration: 2,
        defaultParams: { distance: 100 },
        description: 'Pan down across image',
    },
    cameraPush: {
        defaultDuration: 2,
        defaultParams: {},
        description: 'Camera push in effect',
    },
    cameraPull: {
        defaultDuration: 2,
        defaultParams: {},
        description: 'Camera pull out effect',
    },
    slowFloat: {
        defaultDuration: 3,
        defaultParams: { amplitude: 10, frequency: 0.5 },
        description: 'Slow floating motion',
    },
    parallax: {
        defaultDuration: 3,
        defaultParams: { depth: 0.5 },
        description: 'Parallax depth effect',
    },
    rotate: {
        defaultDuration: 2,
        defaultParams: { degrees: 360 },
        description: 'Rotation effect',
    },
    tilt: {
        defaultDuration: 2,
        defaultParams: {},
        description: 'Tilt effect',
    },
    bounce: {
        defaultDuration: 1.5,
        defaultParams: { amplitude: 20 },
        description: 'Bounce effect',
    },
    shake: {
        defaultDuration: 1,
        defaultParams: { intensity: 5 },
        description: 'Shake effect',
    },
    reveal: {
        defaultDuration: 1.5,
        defaultParams: { direction: 'center' },
        description: 'Reveal from direction',
    },
    fade: {
        defaultDuration: 1,
        defaultParams: { startOpacity: 0, endOpacity: 1 },
        description: 'Fade in/out',
    },
    scale: {
        defaultDuration: 1.5,
        defaultParams: { startScale: 0.3, endScale: 1 },
        description: 'Scale effect',
    },
    blurIn: {
        defaultDuration: 1.5,
        defaultParams: { maxBlur: 10 },
        description: 'Blur in from blurry to clear',
    },
    blurOut: {
        defaultDuration: 1.5,
        defaultParams: { maxBlur: 10 },
        description: 'Blur out from clear to blurry',
    },
};
