const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Create collages from multiple images - ROW WISE (horizontal)
 */
exports.createCollage = async (imagePaths, template) => {
  const collageImages = [];
  const width = template.width || 1080;
  const height = template.height || 1920;
  const collageType = template.collageType || 'horizontal';
  const imagesPerCollage = template.imagesPerCollage || 2;

  // Group images into collage frames
  const collageGroups = [];
  for (let i = 0; i < imagePaths.length; i += imagesPerCollage) {
    const group = imagePaths.slice(i, i + imagesPerCollage);
    collageGroups.push(group);
  }

  for (let i = 0; i < collageGroups.length; i++) {
    const group = collageGroups[i];
    const outputName = `collage_${uuidv4()}.jpg`;
    const outputPath = path.join(path.dirname(group[0]), outputName);

    if (group.length === 1) {
      // Single image - just resize
      await sharp(group[0])
        .resize(width, height, { fit: 'cover' })
        .toFile(outputPath);
    } else if (group.length === 2) {
      // ✅ ROW WISE: 2 images side by side (horizontal)
      await createHorizontalCollage(group, outputPath, width, height);
    } else if (group.length === 3) {
      // ✅ ROW WISE: 3 images in a row
      await createThreeHorizontalCollage(group, outputPath, width, height);
    } else if (group.length === 4) {
      // ✅ ROW WISE: 4 images in a row (2x2 grid)
      await createFourGridCollage(group, outputPath, width, height);
    }

    collageImages.push(outputPath);
  }

  return collageImages;
};

// ============================================================
// ✅ 2 IMAGES - SIDE BY SIDE (HORIZONTAL ROW)
// ============================================================
async function createHorizontalCollage(images, outputPath, width, height) {
  const halfWidth = Math.floor(width / 2);
  
  const leftImage = await sharp(images[0])
    .resize(halfWidth, height, { fit: 'cover' })
    .toBuffer();
  
  const rightImage = await sharp(images[1])
    .resize(halfWidth, height, { fit: 'cover' })
    .toBuffer();
  
  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite([
    { input: leftImage, left: 0, top: 0 },
    { input: rightImage, left: halfWidth, top: 0 }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 3 IMAGES - ALL IN ONE ROW (HORIZONTAL)
// ============================================================
async function createThreeHorizontalCollage(images, outputPath, width, height) {
  const thirdWidth = Math.floor(width / 3);
  
  const img1 = await sharp(images[0])
    .resize(thirdWidth, height, { fit: 'cover' })
    .toBuffer();
  
  const img2 = await sharp(images[1])
    .resize(thirdWidth, height, { fit: 'cover' })
    .toBuffer();
  
  const img3 = await sharp(images[2])
    .resize(thirdWidth, height, { fit: 'cover' })
    .toBuffer();
  
  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite([
    { input: img1, left: 0, top: 0 },
    { input: img2, left: thirdWidth, top: 0 },
    { input: img3, left: thirdWidth * 2, top: 0 }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 4 IMAGES - 2x2 GRID (2 ROWS, 2 COLUMNS)
// ============================================================
async function createFourGridCollage(images, outputPath, width, height) {
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);
  
  const imagesBuffer = await Promise.all(
    images.map(img => sharp(img).resize(halfWidth, halfHeight, { fit: 'cover' }).toBuffer())
  );
  
  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite([
    { input: imagesBuffer[0], left: 0, top: 0 },
    { input: imagesBuffer[1], left: halfWidth, top: 0 },
    { input: imagesBuffer[2], left: 0, top: halfHeight },
    { input: imagesBuffer[3], left: halfWidth, top: halfHeight }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 5+ IMAGES - 3x2 or more grid
// ============================================================
async function createMultiGridCollage(images, outputPath, width, height) {
  const numImages = images.length;
  const cols = Math.min(3, numImages);
  const rows = Math.ceil(numImages / cols);
  
  const cellWidth = Math.floor(width / cols);
  const cellHeight = Math.floor(height / rows);
  
  const composites = [];
  
  for (let i = 0; i < numImages; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const left = col * cellWidth;
    const top = row * cellHeight;
    
    const imgBuffer = await sharp(images[i])
      .resize(cellWidth, cellHeight, { fit: 'cover' })
      .toBuffer();
    
    composites.push({ input: imgBuffer, left, top });
  }
  
  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite(composites)
  .toFile(outputPath);
}