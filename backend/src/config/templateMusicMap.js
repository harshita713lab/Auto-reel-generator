const fs = require('fs');
const path = require('path');

const musicDir = path.join(__dirname, '../../assets/music');

// Map of fixed template IDs to their designated theme music
const TEMPLATE_MUSIC_MAP = {
  simple_1: { musicId: "ReelAudio-1.mp3", musicTitle: "Reel Audio 1" },
  template1: { musicId: "ReelAudio-1.mp3", musicTitle: "Reel Audio 1" },
  Template1: { musicId: "ReelAudio-1.mp3", musicTitle: "Reel Audio 1" },

  template2: { musicId: "ReelAudio-2.mp3", musicTitle: "Reel Audio 2" },
  Template2: { musicId: "ReelAudio-2.mp3", musicTitle: "Reel Audio 2" },
  wedding_seq: { musicId: "ReelAudio-2.mp3", musicTitle: "Reel Audio 2" },

  template3: { musicId: "ReelAudio-3.mp3", musicTitle: "Reel Audio 3" },
  Template3: { musicId: "ReelAudio-3.mp3", musicTitle: "Reel Audio 3" },
  cinematic_wedding: { musicId: "ReelAudio-3.mp3", musicTitle: "Reel Audio 3" },

  template4: { musicId: "ReelAudio-4.mp3", musicTitle: "Reel Audio 4" },
  Template4: { musicId: "ReelAudio-4.mp3", musicTitle: "Reel Audio 4" },
  wedding_split: { musicId: "ReelAudio-4.mp3", musicTitle: "Reel Audio 4" },

  template5: { musicId: "ReelAudio-5.mp3", musicTitle: "Reel Audio 5" },
  Template5: { musicId: "ReelAudio-5.mp3", musicTitle: "Reel Audio 5" },
  Tempalte5: { musicId: "ReelAudio-5.mp3", musicTitle: "Reel Audio 5" },
  white_carousel: { musicId: "ReelAudio-5.mp3", musicTitle: "Reel Audio 5" },

  template6: { musicId: "ReelAudio-6.mp3", musicTitle: "Reel Audio 6" },
  Template6: { musicId: "ReelAudio-6.mp3", musicTitle: "Reel Audio 6" },
  white_masonry: { musicId: "ReelAudio-6.mp3", musicTitle: "Reel Audio 6" },

  template7: { musicId: "ReelAudio-7.mp3", musicTitle: "Reel Audio 7" },
  Template7: { musicId: "ReelAudio-7.mp3", musicTitle: "Reel Audio 7" },
  white_polaroid: { musicId: "ReelAudio-7.mp3", musicTitle: "Reel Audio 7" },

  template8: { musicId: "ReelAudio-8.mp3", musicTitle: "Reel Audio 8" },
  Template8: { musicId: "ReelAudio-8.mp3", musicTitle: "Reel Audio 8" },
  premium_grid: { musicId: "ReelAudio-8.mp3", musicTitle: "Reel Audio 8" },

  template9: { musicId: "ReelAudio-9.mp3", musicTitle: "Reel Audio 9" },
  Template9: { musicId: "ReelAudio-9.mp3", musicTitle: "Reel Audio 9" },
  memory_blend: { musicId: "ReelAudio-9.mp3", musicTitle: "Reel Audio 9" },

  template10: { musicId: "ReelAudio-10.mp3", musicTitle: "Reel Audio 10" },
  Template10: { musicId: "ReelAudio-10.mp3", musicTitle: "Reel Audio 10" },

  template11: { musicId: "ReelAudio-11.mp3", musicTitle: "Reel Audio 11" },
  Template11: { musicId: "ReelAudio-11.mp3", musicTitle: "Reel Audio 11" },
  Tempalte11: { musicId: "ReelAudio-11.mp3", musicTitle: "Reel Audio 11" },

  template12: { musicId: "ReelAudio-12.mp3", musicTitle: "Reel Audio 12" },
  Template12: { musicId: "ReelAudio-12.mp3", musicTitle: "Reel Audio 12" },

  template13: { musicId: "ReelAudio-13.mp3", musicTitle: "Reel Audio 13" },
  Template13: { musicId: "ReelAudio-13.mp3", musicTitle: "Reel Audio 13" },

  template14: { musicId: "ReelAudio-14.mp3", musicTitle: "Reel Audio 14" },
  Template14: { musicId: "ReelAudio-14.mp3", musicTitle: "Reel Audio 14" },

  template15: { musicId: "ReelAudio-15.mp3", musicTitle: "Reel Audio 15" },
  Template15: { musicId: "ReelAudio-15.mp3", musicTitle: "Reel Audio 15" },

  template16: { musicId: "ReelAudio-16.mp3", musicTitle: "Reel Audio 16" },
  Template16: { musicId: "ReelAudio-16.mp3", musicTitle: "Reel Audio 16" },

  template17: { musicId: "ReelAudio-17.mp3", musicTitle: "Reel Audio 17" },
  Template17: { musicId: "ReelAudio-17.mp3", musicTitle: "Reel Audio 17" },

  template18: { musicId: "ReelAudio-18.mp3", musicTitle: "Reel Audio 18" },
  Template18: { musicId: "ReelAudio-18.mp3", musicTitle: "Reel Audio 18" },

  Template25: { musicId: "ReelAudio-7.mp3", musicTitle: "Reel Audio 7" },
  Template26: { musicId: "ReelAudio-8.mp3", musicTitle: "Reel Audio 8" },
  Template27: { musicId: "ReelAudio-9.mp3", musicTitle: "Reel Audio 9" },
};

/**
  * Always return the fixed audio file for a given templateId (e.g. template1 -> ReelAudio-1.mp3, templateN -> ReelAudio-N.mp3).
  */
const getMusicForTemplate = (templateId) => {
  console.log("🔍 getMusicForTemplate called with templateId:", templateId);

  if (!templateId) {
    return "ReelAudio-1.mp3";
  }

  // 1. Direct match in TEMPLATE_MUSIC_MAP
  if (TEMPLATE_MUSIC_MAP[templateId]) {
    console.log("✅ Matched in TEMPLATE_MUSIC_MAP:", templateId, "→", TEMPLATE_MUSIC_MAP[templateId].musicId);
    return TEMPLATE_MUSIC_MAP[templateId].musicId;
  }

  // 2. Extract template index N (e.g. "template1" -> 1, "Template 2" -> 2, "2" -> 2, "template_15" -> 15)
  let num = parseInt(templateId, 10);
  if (isNaN(num)) {
    const match = String(templateId).match(/\d+/);
    if (match) {
      num = parseInt(match[0], 10);
    }
  }

  if (num && num >= 1) {
    const targetFile = `ReelAudio-${num}.mp3`;
    const fullPath = path.join(musicDir, targetFile);

    if (fs.existsSync(fullPath)) {
      console.log(`✅ Fixed mapping: template ${templateId} → ${targetFile}`);
      return targetFile;
    } else {
      // If ReelAudio-N.mp3 does not exist on disk, map deterministically (1..18)
      const fallbackNum = ((num - 1) % 18) + 1;
      const fallbackFile = `ReelAudio-${fallbackNum}.mp3`;
      console.log(`⚠️ ${targetFile} not found on disk. Deterministic fallback → ${fallbackFile}`);
      return fallbackFile;
    }
  }

  console.log("⚠️ Using default fallback: ReelAudio-1.mp3");
  return "ReelAudio-1.mp3";
};

module.exports = {
  TEMPLATE_MUSIC_MAP,
  getMusicForTemplate,
};