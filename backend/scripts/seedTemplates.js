// backend/scripts/seedTemplates.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// ✅ .env फाइल Load करें (ताकि MONGODB_URI मिल जाए)
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// ✅ Schema डिफाइन करें
const TemplateSchema = new mongoose.Schema({
  name: String,
  compositionId: String,
  displayName: String,
  category: String,
  isActive: Boolean,
  priority: Number,
  config: {
    minImages: Number,
    maxImages: Number,
    defaultWidth: Number,
    defaultHeight: Number,
    backgroundColor: String,
  },
});

const Template = mongoose.model('Template', TemplateSchema);

const WEDDING_DIR = path.join(__dirname, '../remotion/src/compositions/Wedding');

async function seedTemplates() {
  try {
    // 🔥 .env से MONGODB_URI लें (Atlas Cloud)
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reelmaker';
    console.log(`🔄 Connecting to MongoDB Atlas...`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ MongoDB Connected');

    // 1️⃣ Check folder
    if (!fs.existsSync(WEDDING_DIR)) {
      console.error(`❌ Folder not found: ${WEDDING_DIR}`);
      process.exit(1);
    }

    // 2️⃣ Read .tsx files
    const files = fs.readdirSync(WEDDING_DIR).filter(f => f.endsWith('.tsx'));
    console.log(`📁 Found ${files.length} template files.`);

    if (files.length === 0) {
      console.error('❌ No .tsx files found.');
      process.exit(1);
    }

    let insertedCount = 0;

    for (const file of files) {
      const filePath = path.join(WEDDING_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // 🔍 IMAGE_COUNT निकालें
      const countMatch = content.match(/IMAGE_COUNT\s*=\s*(\d+)/);
      const imageCount = countMatch ? parseInt(countMatch[1], 10) : null;

      const baseName = file.replace('.tsx', '').toLowerCase();

      // अगर IMAGE_COUNT नहीं है तो Skip करें
      if (imageCount === null) {
        console.log(`⚠️ Skipping ${file} – no IMAGE_COUNT.`);
        continue;
      }

      const priority = parseInt(baseName.replace('template', '')) || 999;

      const templateData = {
        name: baseName,
        compositionId: baseName.charAt(0).toUpperCase() + baseName.slice(1), // "template1" → "Template1"
        displayName: `${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Template`,
        category: 'wedding',
        isActive: true,
        priority: priority,
        config: {
          minImages: imageCount,
          maxImages: imageCount,
          defaultWidth: 1080,
          defaultHeight: 1920,
          backgroundColor: '#000000',
        },
      };

      await Template.updateOne(
        { name: baseName },
        templateData,
        { upsert: true }
      );

      console.log(`✅ Seeded: ${baseName} (IMAGE_COUNT: ${imageCount}, Priority: ${priority})`);
      insertedCount++;
    }

    console.log(`\n🎉 Successfully seeded ${insertedCount} templates.`);
    const total = await Template.countDocuments();
    console.log(`📦 Total Templates in DB: ${total}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedTemplates();