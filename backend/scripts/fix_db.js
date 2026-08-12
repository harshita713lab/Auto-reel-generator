// backend/scripts/fix_db.js
const mongoose = require('mongoose');
const path = require('path');

// ✅ .env फाइल Load करें
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

async function run() {
  try {
    // 🔥 .env से MONGODB_URI लें (Atlas Cloud)
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reelmaker';
    console.log(`🔄 Connecting to MongoDB Atlas...`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ DB Connected Successfully!');

    // 📝 Template1 डालें (Range 12-16 – 13 Images के लिए)
    const data = {
      name: 'template1',
      compositionId: 'Template1',
      displayName: 'Template 1 (Wedding)',
      category: 'wedding',
      isActive: true,
      priority: 1,
      config: {
        minImages: 12,
        maxImages: 16,
        defaultWidth: 1080,
        defaultHeight: 1920,
        backgroundColor: '#000000',
      },
    };

    await Template.updateOne({ name: 'template1' }, data, { upsert: true });
    console.log('✅ Template1 Successfully Inserted/Updated!');

    const count = await Template.countDocuments();
    console.log(`📦 Total Templates in DB: ${count}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();