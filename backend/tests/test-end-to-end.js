// backend/tests/test-end-to-end.js
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const reelController = require('../src/controllers/reelController');
const mongoose = require('mongoose');
const Reel = require('../src/models/Reel');

async function testFullEndToEndReel() {
  console.log('\n--- 🧪 FULL END-TO-END REEL GENERATION TEST ---');
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI missing in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Pick 4 real existing image files from backend/uploads/images
    const uploadsDir = path.join(__dirname, '../uploads/images');
    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jfif') || f.endsWith('.png'));
    
    if (files.length < 4) {
      throw new Error('Need at least 4 image files in uploads/images to run test');
    }

    const testImages = files.slice(0, 4).map((file, idx) => ({
      path: path.join(uploadsDir, file),
      filename: file,
      order: idx,
      duration: 3,
      animation: 'fade',
      transition: 'crossfade'
    }));

    console.log(`📷 Selected ${testImages.length} test images:`, testImages.map(i => i.filename));

    const req = {
      body: {
        title: `EndToEnd Test Reel #${Date.now()}`,
        templateId: 'simple_1',
        images: testImages,
        musicStartTime: 0,
      },
    };

    let responseData = null;
    let statusCode = null;

    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.responseData = data;
        responseData = data;
        statusCode = this.statusCode || 200;
        return this;
      },
    };

    console.log('🚀 Invoking reelController.createReel...');
    await reelController.createReel(req, res);

    console.log(`📩 Controller HTTP Status: ${statusCode}`);
    console.log('📩 Controller Response:', responseData);

    if (statusCode !== 201 && statusCode !== 200) {
      throw new Error(`createReel returned status ${statusCode}: ${JSON.stringify(responseData)}`);
    }

    const reelId = responseData.data._id;
    console.log(`⏳ Monitoring reel background rendering for Reel ID: ${reelId}...`);

    let completed = false;
    for (let poll = 1; poll <= 30; poll++) {
      await new Promise(r => setTimeout(r, 2000));
      const reelDoc = await Reel.findById(reelId);
      
      if (!reelDoc) {
        console.error('❌ Reel document missing!');
        break;
      }

      console.log(`[Poll ${poll}/30] Status: ${reelDoc.status} | Progress: ${reelDoc.progress}%`);

      if (reelDoc.status === 'rendered') {
        completed = true;
        console.log('✅ REEL RENDERED SUCCESSFULLY!');
        console.log(`🎬 Output Video Path: ${reelDoc.outputPath}`);
        console.log(`🌐 Output Video URL: ${reelDoc.outputUrl}`);
        
        if (fs.existsSync(reelDoc.outputPath)) {
          const stats = fs.statSync(reelDoc.outputPath);
          console.log(`📦 Video File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        } else {
          console.error(`⚠️ Video file not found on disk at: ${reelDoc.outputPath}`);
        }
        break;
      } else if (reelDoc.status === 'failed') {
        console.error(`❌ REEL RENDER FAILED WITH ERROR: ${reelDoc.error}`);
        break;
      }
    }

    if (!completed) {
      console.error('⌛ Reel rendering timed out after 60 seconds');
    }

    // Cleanup
    await Reel.findByIdAndDelete(reelId);
    console.log('🧹 Cleanup Test Reel Done');

  } catch (error) {
    console.error('❌ End-To-End Test Failed Exception:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 DB Connection Closed\n');
  }
}

testFullEndToEndReel();
