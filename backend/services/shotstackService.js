// backend/services/shotstackService.js
const axios = require('axios');

// ✅ CORRECT URL - v1 endpoint works with sandbox key
const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
// ✅ Sandbox API URL for direct rendering
const SHOTSTACK_API_URL = 'https://api.shotstack.io/stage';

class ShotstackService {
  constructor() {
    this.apiKey = SHOTSTACK_API_KEY;
    this.baseUrl = SHOTSTACK_API_URL;
    if (!this.apiKey) {
      console.warn('⚠️ SHOTSTACK_API_KEY is not set. Shotstack service may not function correctly.');
    }
  }

  getHeaders() {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    }; 
  }

  // ✅ POST /stage/render (for direct rendering the full payload)
  async renderDirect(payload) {
    try {
      const response = await axios.post(`${this.baseUrl}/render`, payload, { headers: this.getHeaders() });
      console.log('✅ Direct rendering started:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Shotstack Direct Render Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // ✅ GET /v1/render/{id}
  async getRenderStatus(renderId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/render/${renderId}`, // This will be https://api.shotstack.io/stage/render/{id}
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Status Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // ✅ CREATE REEL TEMPLATE
  createReelTemplate(images, textOverlay = '') {
    const clips = images.map((image, index) => ({
      asset: {
        type: 'image',
        src: image.url,
      },
      start: index * 3,
      length: 3,
      transition: {
        in: index === 0 ? 'fade' : 'slideLeft',
        out: 'fade'
      },
      effect: 'zoomIn'
    }));

    const timeline = {
      soundtrack: {
        src: 'https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3',
        effect: 'fadeOut'
      },
      tracks: [{ clips }]
    };

    if (textOverlay) {
      timeline.tracks.push({
        clips: [{
          asset: {
            type: 'title',
            text: textOverlay,
            style: 'minimal',
            size: 'small',
            position: 'bottom'
          },
          start: 1,
          length: 5,
          transition: { in: 'fade' }
        }]
      });
    }

    return {
      timeline: timeline,
      output: {
        format: 'mp4',
        resolution: 'hd',
        fps: 30,
        aspectRatio: '9:16'
      }
    };
  }

  // ✅ GENERATE REEL
  async generateReel(images, musicUrl = '', textOverlay = '') {
    try {
      // 1. Create template
      const payload = this.createReelTemplate(images, textOverlay);
      console.log('📐 Preparing Shotstack payload for direct render...');
      
      // 2. Directly render the payload
      console.log('🎬 Initiating direct rendering...');
      const render = await this.renderDirect(payload);
      
      if (!render?.response?.id) {
        throw new Error('Failed to initiate direct render');
      }
      const renderId = render.response.id;
      console.log(`✅ Rendering started: ${renderId}`);

      // 3. Wait for completion
      let status = 'pending';
      let attempts = 0;
      const maxAttempts = 30;
      
      while (status !== 'done' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusData = await this.getRenderStatus(renderId);
        status = statusData.response.status;
        attempts++;
        console.log(`⏳ Status: ${status} (${attempts}/${maxAttempts})`);
        
        if (status === 'done') {
          return {
            success: true,
            videoUrl: statusData.response.url,
            renderId: renderId
          };
        } else if (status === 'failed') {
            // If render fails, throw an error to exit the loop and catch block
            throw new Error(`Shotstack render failed with status: ${statusData.response.status}`);
        }
      }

      return { success: false, message: 'Render timeout' };
    } catch (error) {
      console.error('❌ Shotstack error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ShotstackService();