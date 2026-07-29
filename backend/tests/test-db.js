// backend/tests/test-db.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Reel = require('../src/models/Reel');

async function testDatabase() {
  console.log('\n--- 🧪 TEST 1: DATABASE & MODEL TEST ---');
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI .env file me missing hai!');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');

    // Dummy Reel Schema Save Test
    const dummyReel = new Reel({
      title: 'Test Reel',
      images: [
        {
          filename: 'test1.jpg',
          path: '/uploads/temp/test1.jpg',
          order: 0,
        },
      ],
      duration: 10,
      templateId: 'simple_1',
    });

    const savedReel = await dummyReel.save();
    console.log('✅ Reel Model Saved Successfully ID:', savedReel._id);

    // Cleanup Test Data
    await Reel.findByIdAndDelete(savedReel._id);
    console.log('🧹 Cleanup Done (Test Reel Deleted)');

  } catch (error) {
    console.error('❌ DB Test Failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 DB Connection Closed\n');
  }
}

testDatabase();