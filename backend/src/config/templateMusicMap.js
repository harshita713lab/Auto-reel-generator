const getMusicForTemplate = (templateId, imageCount) => {
  console.log("🔍 getMusicForTemplate called with:", {
    templateId,
    imageCount,
  });

  // ==================================================
  // 1. TEMPLATE ID SE MUSIC
  // ==================================================

  let num = parseInt(templateId);

  if (isNaN(num)) {
    const match = String(templateId).match(/\d+/);

    if (match) {
      num = parseInt(match[0], 10);
    }
  }

  if (num && num >= 1) {
    const music = `ReelAudio-${num}.mp3`;

    console.log(
      "✅ Using templateId:",
      templateId,
      "→",
      music
    );

    return music;
  }

  // ==================================================
  // 2. IMAGE COUNT FALLBACK
  // ==================================================

  const fallbackMap = {
    14: "ReelAudio-1.mp3",
    13: "ReelAudio-2.mp3",
    10: "ReelAudio-3.mp3",
    9: "ReelAudio-4.mp3",
    5: "ReelAudio-5.mp3",
    12: "ReelAudio-6.mp3",
    8:  'ReelAudio-7.mp3',
    17: "ReelAudio-8.mp3",
    15: "ReelAudio-9.mp3",
    16: "ReelAudio-10.mp3",
    18:  'ReelAudio-11.mp3',
    23: 'ReelAudio-12.mp3',
    4: "ReelAudio-13.mp3",
  };

  if (fallbackMap[imageCount]) {
    console.log(
      "✅ Using fallback for imageCount:",
      imageCount,
      "→",
      fallbackMap[imageCount]
    );

    return fallbackMap[imageCount];
  }

  // ==================================================
  // 3. DEFAULT
  // ==================================================

  console.log("⚠️ Using default: ReelAudio-1.mp3");

  return "ReelAudio-1.mp3";
};

module.exports = {
  getMusicForTemplate,
};