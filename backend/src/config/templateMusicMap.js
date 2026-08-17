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
};

const getMusicForTemplate = (templateId, imageCount) => {
  console.log("🔍 getMusicForTemplate called with:", {
    templateId,
    imageCount,
  });

  // Check map first
  if (templateId && TEMPLATE_MUSIC_MAP[templateId]) {
    return TEMPLATE_MUSIC_MAP[templateId].musicId;
  }

  // Extract number from templateId
  let num = parseInt(templateId);
  if (isNaN(num)) {
    const match = String(templateId).match(/\d+/);
    if (match) {
      num = parseInt(match[0], 10);
    }
  }

  if (num && num >= 1) {
    const music = `ReelAudio-${num}.mp3`;
    console.log("✅ Using templateId:", templateId, "→", music);
    return music;
  }

  // Fallback map
  const fallbackMap = {
    19: "ReelAudio-34.mp3",
    14: "ReelAudio-2.mp3",
    10: "ReelAudio-3.mp3",
    9: "ReelAudio-29.mp3",
  };

  if (fallbackMap[imageCount]) {
    console.log("✅ Using fallback for imageCount:", imageCount, "→", fallbackMap[imageCount]);
    return fallbackMap[imageCount];
  }

  console.log("⚠️ Using default: ReelAudio-1.mp3");
  return "ReelAudio-1.mp3";
};

module.exports = {
  TEMPLATE_MUSIC_MAP,
  getMusicForTemplate,
};