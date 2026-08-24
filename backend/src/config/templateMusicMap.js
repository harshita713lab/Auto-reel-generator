const TEMPLATE_MUSIC_MAP = {
  simple_1: { musicId: 'ReelAudio-1.mp3', musicTitle: 'Reel Audio 1' },
  wedding_seq: { musicId: 'ReelAudio-20.mp3', musicTitle: 'Reel Audio 20' },
  cinematic_wedding: { musicId: 'ReelAudio-9.mp3', musicTitle: 'Reel Audio 9' },
  wedding_split: { musicId: 'ReelAudio-3.mp3', musicTitle: 'Reel Audio 3' },
  white_carousel: { musicId: 'ReelAudio-10.mp3', musicTitle: 'Reel Audio 10' },
  white_masonry: { musicId: 'ReelAudio-7.mp3', musicTitle: 'Reel Audio 7' },
  white_polaroid: { musicId: 'ReelAudio-11.mp3', musicTitle: 'Reel Audio 11' },
  premium_grid: { musicId: 'ReelAudio-15.mp3', musicTitle: 'Reel Audio 15' },
  Template25: { musicId: 'ReelAudio-25.mp3', musicTitle: 'Reel Audio 25' },
  Template26: { musicId: 'ReelAudio-26.mp3', musicTitle: 'Reel Audio 26' },
  Template27: { musicId: 'ReelAudio-27.mp3', musicTitle: 'Reel Audio 27' },
  Template28: { musicId: 'ReelAudio-28.mp3', musicTitle: 'Reel Audio 28' },
  Template29: { musicId: 'ReelAudio-29.mp3', musicTitle: 'Reel Audio 29' },
  Template30: { musicId: 'ReelAudio-30.mp3', musicTitle: 'Reel Audio 30' },
  Template31: { musicId: 'ReelAudio-31.mp3', musicTitle: 'Reel Audio 31' },
  Template32: { musicId: 'ReelAudio-32.mp3', musicTitle: 'Reel Audio 32' },
  Template33: { musicId: 'ReelAudio-33.mp3', musicTitle: 'Reel Audio 33' },
  Template34: { musicId: 'ReelAudio-34.mp3', musicTitle: 'Reel Audio 34' },
  Template35: { musicId: 'ReelAudio-35.mp3', musicTitle: 'Apna Bana Le Piya' },
  Template36: { musicId: 'ReelAudio-36.mp3', musicTitle: 'Reel Audio 36' },
  Template37: { musicId: 'ReelAudio-37.mp3', musicTitle: 'Reel Audio 37' },
  Template38: { musicId: 'ReelAudio-38.mp3', musicTitle: 'Chuliya Tune' },
  Template50: { musicId: 'ReelAudio-50.mp3', musicTitle: 'Forever & Always' },
};

const fs = require('fs');
const path = require('path');

const getMusicForTemplate = (templateId, imageCount) => {
  console.log("🔍 getMusicForTemplate called with:", {
    templateId,
    imageCount,
  });

  // Dynamic Rule: VideoTemplateN -> videoAudioN.mp3 / videoAudioN.wav / videoAudioN.m4a
  if (templateId && /videoTemplate\d+/i.test(String(templateId))) {
    const match = String(templateId).match(/\d+/);
    const num = match ? match[0] : '1';
    const audioExts = ['mp3', 'wav', 'm4a', 'aac'];

    // Try videoAudioN first
    for (const ext of audioExts) {
      const candidate = `videoAudio${num}.${ext}`;
      const p1 = path.join(__dirname, '../../assets/music', candidate);
      const p2 = path.join(__dirname, '../../assets/songs', candidate);
      if ((fs.existsSync(p1) && fs.statSync(p1).size > 0) || (fs.existsSync(p2) && fs.statSync(p2).size > 0)) {
        console.log(`🎵 Matched Video Audio: ${candidate} for ${templateId}`);
        return candidate;
      }
    }

    // Try videoAudio1 or videoAudio fallback
    for (const ext of audioExts) {
      const fallbackCandidate = `videoAudio1.${ext}`;
      const p1 = path.join(__dirname, '../../assets/music', fallbackCandidate);
      const p2 = path.join(__dirname, '../../assets/songs', fallbackCandidate);
      if ((fs.existsSync(p1) && fs.statSync(p1).size > 0) || (fs.existsSync(p2) && fs.statSync(p2).size > 0)) {
        console.log(`🎵 Matched fallback Video Audio: ${fallbackCandidate} for ${templateId}`);
        return fallbackCandidate;
      }
    }

    console.log(`🎵 Using default Video Audio target: videoAudio${num}.mp3 for ${templateId}`);
    return `videoAudio${num}.mp3`;
  }

  let selectedMusic = 'ReelAudio-1.mp3';

  // Check map first
  if (templateId && TEMPLATE_MUSIC_MAP[templateId]) {
    selectedMusic = TEMPLATE_MUSIC_MAP[templateId].musicId;
  } else {
    // Extract number from templateId
    let num = parseInt(templateId);
    if (isNaN(num)) {
      const match = String(templateId).match(/\d+/);
      if (match) {
        num = parseInt(match[0], 10);
      }
    }

    if (num && num >= 1) {
      selectedMusic = `ReelAudio-${num}.mp3`;
    } else {
      const fallbackMap = {
        19: "ReelAudio-34.mp3",
        14: "ReelAudio-2.mp3",
        10: "ReelAudio-3.mp3",
        9: "ReelAudio-29.mp3",
      };
      if (fallbackMap[imageCount]) {
        selectedMusic = fallbackMap[imageCount];
      }
    }
  }

  // Check if file exists and is non-empty (>0 bytes)
  const musicPath = path.join(__dirname, '../../assets/music', selectedMusic);
  try {
    if (fs.existsSync(musicPath)) {
      const stats = fs.statSync(musicPath);
      if (stats.size > 0) {
        console.log("✅ Using valid music file:", selectedMusic, `(${stats.size} bytes)`);
        return selectedMusic;
      } else {
        console.warn(`⚠️ Music file ${selectedMusic} is 0 bytes! Falling back to ReelAudio-1.mp3`);
      }
    } else {
      console.warn(`⚠️ Music file ${selectedMusic} does not exist! Falling back to ReelAudio-1.mp3`);
    }
  } catch (err) {
    console.warn(`⚠️ Error checking music file ${selectedMusic}:`, err.message);
  }

  return "ReelAudio-1.mp3";
};

module.exports = {
  TEMPLATE_MUSIC_MAP,
  getMusicForTemplate,
};