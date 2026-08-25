const animationService = require('../src/services/template/animationService');
const effectService = require('../src/services/template/effectService');
const transitionService = require('../src/services/template/transitionService');
const templateService = require('../src/services/template/templateService');
const bpmService = require('../src/services/audio/bpmService');
const beatService = require('../src/services/audio/beatService');
const waveformService = require('../src/services/audio/waveformService');
const fileService = require('../src/services/storage/fileService');
const outputService = require('../src/services/storage/outputService');

describe('Core Services Unit Test Suite', () => {
  describe('Animation Service', () => {
    test('Should return all available animation names', () => {
      const animations = animationService.getAllAnimations();
      expect(Array.isArray(animations)).toBe(true);
      expect(animations).toContain('kenBurns');
      expect(animations).toContain('zoomIn');
      expect(animations).toContain('fade');
    });

    test('Should compute correct values for zoomIn animation', () => {
      const res = animationService.zoomIn({ progress: 0.5, startScale: 1, endScale: 2 });
      expect(res.scale).toBe(1.5);
    });

    test('Should compute correct values for kenBurns animation', () => {
      const res = animationService.kenBurns({ progress: 1, startScale: 1, endScale: 1.5, startX: 0, endX: 20 });
      expect(res.scale).toBe(1.5);
      expect(res.x).toBe(20);
    });

    test('Should return default animation when unknown animation is passed', () => {
      const animFn = animationService.getAnimation('invalidAnimationName');
      expect(typeof animFn).toBe('function');
    });
  });

  describe('Effect Service', () => {
    test('Should return all available effect names', () => {
      const effects = effectService.getAllEffects();
      expect(Array.isArray(effects)).toBe(true);
      expect(effects).toContain('vignette');
      expect(effects).toContain('lightLeak');
    });

    test('Should return correct default config for lightLeak', () => {
      const config = effectService.getDefaultConfig('lightLeak');
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });
  });

  describe('Transition Service', () => {
    test('Should list available transition types', () => {
      const transitions = transitionService.getAllTransitions();
      expect(Array.isArray(transitions)).toBe(true);
      expect(transitions).toContain('fade');
      expect(transitions).toContain('crossFade');
      expect(transitions).toContain('slideLeft');
    });
  });

  describe('Template Service', () => {
    test('Should generate valid template configuration object', () => {
      const mockTemplate = {
        name: 'Test Template',
        category: 'wedding',
        defaultAnimation: 'kenBurns',
        defaultTransition: 'fade',
        getEnabledAnimations: () => [{ type: 'kenBurns' }],
        getEnabledTransitions: () => [{ type: 'fade' }],
        getEnabledEffects: () => [{ type: 'vignette' }],
        config: { defaultWidth: 1080, defaultHeight: 1920 }
      };

      const config = templateService.generateTemplateConfig(mockTemplate, { imageCount: 5, duration: 3 });
      expect(config.name).toBe('Test Template');
      expect(config.width).toBe(1080);
      expect(config.height).toBe(1920);
      expect(config.images.length).toBe(5);
    });

    test('Should validate template config accurately', () => {
      const valid = templateService.validateTemplateConfig({ name: 'Valid Template', category: 'wedding' });
      expect(valid.valid).toBe(true);

      const invalid = templateService.validateTemplateConfig({ category: 'wedding' });
      expect(invalid.valid).toBe(false);
      expect(invalid.errors).toContain('Template name is required');
    });
  });

  describe('Audio Services', () => {
    test('bpmService should have detectBPM method', () => {
      expect(typeof bpmService.detectBPM).toBe('function');
    });

    test('beatService should have detectBeats method', () => {
      expect(typeof beatService.detectBeats).toBe('function');
    });
  });

  describe('Storage Services', () => {
    test('outputService should configure output directories', () => {
      expect(outputService.outputDirs).toBeDefined();
      expect(outputService.outputDirs.renders).toBeDefined();
    });
  });
});
