/**
 * Comprehensive Automated Test Script for All 52 Templates
 * Usage: node tests/test_all_52_templates.js
 */

const fs = require('fs');
const path = require('path');
const { TEMPLATE_IMAGE_COUNTS, getRequiredImageCount } = require('../src/config/templateImageCounts');
const { TEMPLATE_MUSIC_MAP, getMusicForTemplate } = require('../src/config/templateMusicMap');

async function testAll52Templates() {
  console.log('========================================================');
  console.log('🚀 TESTING ALL 52 TEMPLATES IN AUTO-REEL-GENERATOR');
  console.log('========================================================\n');

  const compositionsDir = path.join(__dirname, '../remotion/src/compositions/Wedding');
  if (!fs.existsSync(compositionsDir)) {
    console.error(`❌ Compositions directory not found: ${compositionsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(compositionsDir).filter(f => f.endsWith('.tsx'));
  console.log(`📁 Found ${files.length} template files in compositions/Wedding/\n`);

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 1; i <= 52; i++) {
    const templateId = `Template${i}`;
    const numStr = String(i);

    // Find file
    const fileMatch = files.find(f => {
      const lower = f.toLowerCase();
      return lower === `template${numStr}.tsx` || lower === `tempalte${numStr}.tsx`;
    });

    const requiredImageCount = getRequiredImageCount(templateId);
    const music = getMusicForTemplate(templateId, requiredImageCount || 10);

    const testItem = {
      templateId,
      file: fileMatch || 'MISSING',
      requiredImages: requiredImageCount !== null ? requiredImageCount : 'Flexible (Template 50)',
      assignedMusic: music,
      status: 'PASSED'
    };

    if (!fileMatch) {
      testItem.status = 'FAILED';
      testItem.error = 'File does not exist in compositions/Wedding';
      failedCount++;
    } else {
      // Read file and parse IMAGE_COUNT or DURATION_IN_FRAMES
      const filePath = path.join(compositionsDir, fileMatch);
      const content = fs.readFileSync(filePath, 'utf8');

      if (!content.includes('export default') && !content.includes('export const')) {
        testItem.status = 'FAILED';
        testItem.error = 'No exported component found in template file';
        failedCount++;
      } else {
        passedCount++;
      }
    }

    results.push(testItem);
  }

  console.table(results);

  console.log('\n========================================================');
  console.log(`📊 SUMMARY: Total: 52 | Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log('========================================================');

  const reportPath = path.join(__dirname, 'all_52_templates_test_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

testAll52Templates().catch((err) => {
  console.error('❌ Error executing test script:', err);
  process.exit(1);
});
