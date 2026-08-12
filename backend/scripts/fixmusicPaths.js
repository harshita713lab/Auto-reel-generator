console.log('🚀 Script started...');

const fs = require('fs');
const path = require('path');

const WEDDING_DIR = path.join(__dirname, '../remotion/src/compositions/Wedding');
console.log(`📁 Checking folder: ${WEDDING_DIR}`);

if (!fs.existsSync(WEDDING_DIR)) {
  console.error(`❌ Folder NOT FOUND: ${WEDDING_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(WEDDING_DIR).filter(f => f.endsWith('.tsx'));
console.log(`📄 Found ${files.length} .tsx files.`);

if (files.length === 0) {
  console.log('⚠️ No .tsx files found.');
  process.exit(0);
}

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(WEDDING_DIR, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Add staticFile import if missing
  if (!content.includes('staticFile')) {
    const importMatch = content.match(/import \{([^}]+)\} from "remotion";/);
    if (importMatch) {
      content = content.replace(
        /import \{([^}]+)\} from "remotion";/,
        `import { $1, staticFile } from "remotion";`
      );
      modified = true;
    }
  }

  // Wrap "/music/...mp3" with staticFile()
  const musicMatches = content.match(/"\/music\/[^"]+\.mp3"/g);
  if (musicMatches) {
    console.log(`🎵 Found ${musicMatches.length} music paths in ${file}`);
    content = content.replace(
      /"\/music\/[^"]+\.mp3"/g,
      (match) => `staticFile(${match})`
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${file}`);
    fixedCount++;
  } else {
    console.log(`⏭️ No changes needed: ${file}`);
  }
});

console.log(`🎉 Done! Fixed ${fixedCount} files.`);