// backend/tests/test-reel.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const reelController = require('../src/controllers/reelController');
const mongoose = require('mongoose');

async function testReelController() {
  console.log('\n--- 🧪 TEST 2: REEL CONTROLLER LOGIC TEST ---');
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Mock Express Request & Response
    const req = {
      body: {
        title: 'Automation Test Reel',
        templateId: 'simple_1',
        images: [
          {
            path: 'uploads/temp/sample1.jpg',
            filename: 'sample1.jpg',
          },
          {
            path: 'uploads/temp/sample2.jpg',
            filename: 'sample2.jpg',
          },
        ],
        duration: 6,
      },
    };

    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.responseData = data;
        return this;
      },
    };

    await reelController.createReel(req, res);

    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('✅ Controller Success Response:', res.responseData);
      // Clean up
      if (res.responseData?.data?._id) {
        const Reel = require('../src/models/Reel');
        await Reel.findByIdAndDelete(res.responseData.data._id);
        console.log('🧹 Cleanup Test Reel Done');
      }
    } else {
      console.error('❌ Controller Error Response:', res.statusCode, res.responseData);
    }

  } catch (error) {
    console.error('❌ Controller Test Exception:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testReelController();