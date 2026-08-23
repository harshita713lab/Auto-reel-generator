const { TEMPLATE_IMAGE_COUNTS, getRequiredImageCount } = require('../src/config/templateImageCounts');

describe('Template Image Count Requirements Test', () => {
  const expectedCounts = {
    Template1: 14,
    Template2: 13,
    Template3: 11,
    Template4: 5,
    Template5: 5,
    Template6: 12,
    Template7: 8,
    Template8: 17,
    Template9: 15,
    Template10: 16,
    Template11: 18,
    Template12: 23,
    Template13: 4,
    Template14: 11,
    Template15: 4,
    Template16: 13,
    Template17: 12,
    Template18: 17,
    Template19: 7,
    Template20: 14,
    Template21: 3,
    Template22: 4,
    Template23: 14,
    Template24: 14,
    Template25: 24,
    Template26: 9,
    Template27: 9,
    Template28: 22,
    Template29: 9,
    Template30: 8,
    Template31: 8,
    Template32: 25,
    Template33: 4,
    Template34: 19,
    Template35: 25,
    Template36: 24,
    Template37: 18,
    Template38: 1
  };

  Object.entries(expectedCounts).forEach(([templateId, count]) => {
    test(`${templateId} should have required image count of ${count}`, () => {
      expect(getRequiredImageCount(templateId)).toBe(count);
    });
  });

  test('Template 50 should return null for flexible image count', () => {
    expect(getRequiredImageCount('Template50')).toBeNull();
  });
});
