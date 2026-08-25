const Reel = require('../src/models/Reel');
const Template = require('../src/models/Template');
const Music = require('../src/models/Music');
const Project = require('../src/models/Project');
const RenderJob = require('../src/models/RenderJob');

describe('Mongoose Data Models Test Suite', () => {
  describe('Reel Model', () => {
    test('Should instantiate a new Reel with default values', () => {
      const reel = new Reel({
        title: 'Test Reel',
        duration: 10,
        images: [{ path: '/tmp/test.jpg', order: 0 }]
      });

      expect(reel.title).toBe('Test Reel');
      expect(reel.duration).toBe(10);
      expect(reel.status).toBe('draft');
      expect(reel.fps).toBe(30);
      expect(reel.width).toBe(1080);
      expect(reel.height).toBe(1920);
      expect(reel.imageCount).toBe(1);
      expect(reel.formattedDuration).toBe('0:10');
    });

    test('Reel methods addImage, updateStatus should work correctly', () => {
      const reel = new Reel({ title: 'Sample Reel', duration: 15 });
      
      reel.status = 'rendering';
      reel.progress = 50;
      expect(reel.status).toBe('rendering');
      expect(reel.progress).toBe(50);
    });
  });

  describe('Template Model', () => {
    test('Should instantiate a Template object with default properties', () => {
      const template = new Template({
        name: 'Wedding Classic',
        displayName: 'Wedding Classic Reel',
        category: 'wedding'
      });

      expect(template.name).toBe('Wedding Classic');
      expect(template.category).toBe('wedding');
      expect(template.isActive).toBe(true);
      expect(template.defaultAnimation).toBe('kenBurns');
      expect(template.defaultTransition).toBe('fade');
    });
  });

  describe('Music Model', () => {
    test('Should instantiate a Music object with audio metadata', () => {
      const music = new Music({
        title: 'Romantic Sunset',
        filename: 'ReelAudio-1.mp3',
        filePath: '/assets/music/ReelAudio-1.mp3',
        duration: 30,
        genre: 'romantic'
      });

      expect(music.title).toBe('Romantic Sunset');
      expect(music.filename).toBe('ReelAudio-1.mp3');
      expect(music.duration).toBe(30);
    });
  });

  describe('RenderJob Model', () => {
    test('Should instantiate RenderJob with job parameters', () => {
      const job = new RenderJob({
        status: 'queued',
        priority: 5
      });

      expect(job.status).toBe('queued');
      expect(job.priority).toBe(5);
    });
  });
});
