const fs = require('fs');
const path = require('path');
const { TEMPLATE_IMAGE_COUNTS, getRequiredImageCount } = require('../src/config/templateImageCounts');
const { TEMPLATE_MUSIC_MAP, getMusicForTemplate } = require('../src/config/templateMusicMap');

describe('All 52 Templates Test Suite', () => {
  const compositionsDir = path.join(__dirname, '../remotion/src/compositions/Wedding');
  let templateFiles = [];

  beforeAll(() => {
    if (fs.existsSync(compositionsDir)) {
      templateFiles = fs.readdirSync(compositionsDir).filter(f => f.endsWith('.tsx'));
    }
  });

  test('Should find all 52 template files in Wedding compositions directory', () => {
    expect(templateFiles.length).toBe(52);
  });

  // Dynamically test every template file from 1 to 52
  const templateIds = Array.from({ length: 52 }, (_, i) => `Template${i + 1}`);

  test.each(templateIds)('%s composition metadata and configuration should be valid', (templateId) => {
    const num = templateId.replace('Template', '');
    
    // Check if composition file exists (handles casing variations like TemplateX.tsx, templateX.tsx, TempalteX.tsx)
    const matchingFile = templateFiles.find(file => {
      const lower = file.toLowerCase();
      return lower === `template${num}.tsx` || lower === `tempalte${num}.tsx`;
    });

    expect(matchingFile).toBeDefined();

    // Verify image count resolution
    const requiredImages = getRequiredImageCount(templateId);
    if (num !== '50') {
      expect(typeof requiredImages).toBe('number');
      expect(requiredImages).toBeGreaterThan(0);
    } else {
      // Template 50 is flexible
      expect(requiredImages).toBeNull();
    }

    // Verify music mapping
    const musicFile = getMusicForTemplate(templateId);
    expect(musicFile).toBeDefined();
    expect(typeof musicFile).toBe('string');
    expect(musicFile.endsWith('.mp3')).toBe(true);
  });

  test('Template 38 should specifically require exactly 1 image', () => {
    expect(getRequiredImageCount('Template38')).toBe(1);
    expect(getRequiredImageCount('38')).toBe(1);
    expect(getRequiredImageCount('template38')).toBe(1);
  });

  test('All TEMPLATE_IMAGE_COUNTS keys map to positive numbers', () => {
    Object.entries(TEMPLATE_IMAGE_COUNTS).forEach(([key, count]) => {
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });
  });
});
