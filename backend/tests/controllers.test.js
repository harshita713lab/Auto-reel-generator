const healthController = require('../src/controllers/healthController');
const templateController = require('../src/controllers/templateController');

describe('API Controllers Unit Test Suite', () => {
  describe('Health Controller', () => {
    let req, res;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    test('healthController.check should return status 200 with service info', async () => {
      await healthController.check(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ok',
          service: 'reel-generator-api'
        })
      );
    });

    test('healthController.ping should return pong', () => {
      healthController.ping(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'pong'
        })
      );
    });

    test('healthController.details should include memory and CPU statistics', async () => {
      await healthController.details(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ok',
          memory: expect.any(Object)
        })
      );
    });
  });

  describe('Template Controller', () => {
    let req, res;

    beforeEach(() => {
      req = { query: {}, params: {}, body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    test('templateController.getAnimations should return available animations', async () => {
      await templateController.getAnimations(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array)
        })
      );
    });

    test('templateController.getTransitions should return available transitions', async () => {
      await templateController.getTransitions(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array)
        })
      );
    });

    test('templateController.getEffects should return available effects', async () => {
      await templateController.getEffects(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array)
        })
      );
    });
  });
});
