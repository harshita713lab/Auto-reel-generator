const healthRoutes = require('../src/routes/healthRoutes');
const musicRoutes = require('../src/routes/musicRoutes');
const reelRoutes = require('../src/routes/reelRoutes');
const renderRoutes = require('../src/routes/renderRoutes');
const templateRoutes = require('../src/routes/templateRoutes');
const uploadRoutes = require('../src/routes/uploadRoutes');

describe('Express API Routes Initialization Test', () => {
  test('Health routes router should be defined', () => {
    expect(healthRoutes).toBeDefined();
    expect(typeof healthRoutes).toBe('function');
  });

  test('Music routes router should be defined', () => {
    expect(musicRoutes).toBeDefined();
    expect(typeof musicRoutes).toBe('function');
  });

  test('Reel routes router should be defined', () => {
    expect(reelRoutes).toBeDefined();
    expect(typeof reelRoutes).toBe('function');
  });

  test('Render routes router should be defined', () => {
    expect(renderRoutes).toBeDefined();
    expect(typeof renderRoutes).toBe('function');
  });

  test('Template routes router should be defined', () => {
    expect(templateRoutes).toBeDefined();
    expect(typeof templateRoutes).toBe('function');
  });

  test('Upload routes router should be defined', () => {
    expect(uploadRoutes).toBeDefined();
    expect(typeof uploadRoutes).toBe('function');
  });
});
