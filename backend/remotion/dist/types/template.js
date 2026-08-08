export const TransitionDefaults = {
    fade: {
        component: 'FadeTransition',
        defaultDuration: 0.5,
        description: 'Simple fade transition',
    },
    crossFade: {
        component: 'FadeTransition',
        defaultDuration: 0.5,
        description: 'Cross fade between images',
    },
    slideLeft: {
        component: 'SlideTransition',
        defaultDuration: 0.5,
        description: 'Slide to the left',
    },
    slideRight: {
        component: 'SlideTransition',
        defaultDuration: 0.5,
        description: 'Slide to the right',
    },
    slideUp: {
        component: 'SlideTransition',
        defaultDuration: 0.5,
        description: 'Slide up',
    },
    slideDown: {
        component: 'SlideTransition',
        defaultDuration: 0.5,
        description: 'Slide down',
    },
    zoom: {
        component: 'ZoomTransition',
        defaultDuration: 0.5,
        description: 'Zoom transition',
    },
    blur: {
        component: 'BlurTransition',
        defaultDuration: 0.5,
        description: 'Blur transition',
    },
    flash: {
        component: 'FlashTransition',
        defaultDuration: 0.3,
        description: 'Flash transition',
    },
    whipPan: {
        component: 'WhipTransition',
        defaultDuration: 0.4,
        description: 'Whip pan transition',
    },
    cameraMove: {
        component: 'CameraMoveTransition',
        defaultDuration: 0.5,
        description: 'Camera move transition',
    },
    filmBurn: {
        component: 'FilmBurnTransition',
        defaultDuration: 0.6,
        description: 'Film burn transition',
    },
    lightLeak: {
        component: 'LightLeakTransition',
        defaultDuration: 0.5,
        description: 'Light leak transition',
    },
    dissolve: {
        component: 'DissolveTransition',
        defaultDuration: 0.6,
        description: 'Dissolve transition',
    },
    morph: {
        component: 'MorphTransition',
        defaultDuration: 0.5,
        description: 'Morph transition',
    },
    none: {
        component: 'None',
        defaultDuration: 0,
        description: 'No transition',
    },
};
export const EffectDefaults = {
    lightLeak: {
        component: 'LightLeak',
        defaultConfig: { intensity: 0.3, color: '#FFA500' },
        description: 'Warm light leak overlay',
    },
    lensFlare: {
        component: 'LensFlare',
        defaultConfig: { intensity: 0.4, position: 'topRight' },
        description: 'Lens flare effect',
    },
    glow: {
        component: 'Glow',
        defaultConfig: { intensity: 0.5, color: '#FFFFFF', radius: 20 },
        description: 'Soft glow effect',
    },
    bloom: {
        component: 'Bloom',
        defaultConfig: { threshold: 0.7, intensity: 0.5, radius: 30 },
        description: 'Bloom effect',
    },
    filmGrain: {
        component: 'Grain',
        defaultConfig: { intensity: 0.2, size: 2 },
        description: 'Film grain texture',
    },
    dustParticles: {
        component: 'Dust',
        defaultConfig: { count: 50, size: 3, opacity: 0.3 },
        description: 'Dust particles',
    },
    bokeh: {
        component: 'Bokeh',
        defaultConfig: { count: 30, size: 15, blur: 5 },
        description: 'Bokeh effect',
    },
    vignette: {
        component: 'Vignette',
        defaultConfig: { intensity: 0.5, radius: 0.8, color: '#000000' },
        description: 'Vignette effect',
    },
    motionBlur: {
        component: 'MotionBlur',
        defaultConfig: { intensity: 0.3, angle: 0 },
        description: 'Motion blur effect',
    },
    floatingParticles: {
        component: 'Particles',
        defaultConfig: { count: 100, size: 5, speed: 0.5, opacity: 0.4 },
        description: 'Floating particles',
    },
    softShadows: {
        component: 'SoftShadows',
        defaultConfig: { intensity: 0.3, radius: 10 },
        description: 'Soft shadows',
    },
    colorOverlay: {
        component: 'ColorOverlay',
        defaultConfig: { color: '#000000', opacity: 0.2, blendMode: 'overlay' },
        description: 'Color overlay',
    },
    gradientOverlay: {
        component: 'GradientOverlay',
        defaultConfig: { colors: ['#000000', '#FFFFFF'], direction: 'vertical', opacity: 0.3 },
        description: 'Gradient overlay',
    },
    noiseTexture: {
        component: 'NoiseTexture',
        defaultConfig: { intensity: 0.2, size: 1 },
        description: 'Noise texture',
    },
};
