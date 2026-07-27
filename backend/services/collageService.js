const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Create collages from multiple images - ROW WISE
 */
exports.createCollage = async (imagePaths, template) => {
  const collageImages = [];
  const width = template.width || 1080;
  const height = template.height || 1920;
  const imagesPerCollage = template.imagesPerCollage || 2;
  const collageType = template.collageType || 'vertical'; // 'vertical' or 'horizontal'

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
      await sharp(group[0])
        .resize(width, height, { fit: 'cover' })
        .toFile(outputPath);
    } else if (group.length === 2) {
      // ✅ 2 images - side by side (50% each)
      await createTwoRowCollage(group, outputPath, width, height);
    } else if (group.length === 3) {
      // ✅ 3 images - all in one row (33.33% each)
      await createThreeRowCollage(group, outputPath, width, height);
    } else if (group.length === 4) {
      // ✅ 4 images - 2x2 grid (2 rows, 2 columns)
      await createFourRowCollage(group, outputPath, width, height);
    } else if (group.length >= 5) {
      // ✅ 5+ images - 3 columns grid
      await createMultiRowCollage(group, outputPath, width, height);
    }

    collageImages.push(outputPath);
  }

  return collageImages;
};

// ============================================================
// ✅ 2 IMAGES - SIDE BY SIDE (50% - 50%)
// ============================================================
async function createTwoRowCollage(images, outputPath, width, height) {
  const halfWidth = Math.floor(width / 2);
  
  const img1 = await sharp(images[0])
    .resize(halfWidth, height, { fit: 'cover' })
    .toBuffer();
  
  const img2 = await sharp(images[1])
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
    { input: img1, left: 0, top: 0 },
    { input: img2, left: halfWidth, top: 0 }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 3 IMAGES - ALL IN ONE ROW (33.33% each)
// ============================================================
async function createThreeRowCollage(images, outputPath, width, height) {
  const thirdWidth = Math.floor(width / 3);
  
  const imagesBuffer = await Promise.all(
    images.map(img => sharp(img).resize(thirdWidth, height, { fit: 'cover' }).toBuffer())
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
    { input: imagesBuffer[1], left: thirdWidth, top: 0 },
    { input: imagesBuffer[2], left: thirdWidth * 2, top: 0 }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 4 IMAGES - 2x2 GRID (2 ROWS x 2 COLUMNS)
// ============================================================
async function createFourRowCollage(images, outputPath, width, height) {
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
// ✅ 5+ IMAGES - 3 COLUMNS GRID (Dynamic rows)
// ============================================================
async function createMultiRowCollage(images, outputPath, width, height) {
  const numImages = images.length;
  const cols = Math.min(3, numImages);
  const rows = Math.ceil(numImages / cols);
  const gap = 4;
  
  const cellWidth = Math.floor((width - gap * (cols + 1)) / cols);
  const cellHeight = Math.floor((height - gap * (rows + 1)) / rows);
  
  const composites = [];
  
  for (let i = 0; i < numImages; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const left = gap + col * (cellWidth + gap);
    const top = gap + row * (cellHeight + gap);
    
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
      background: { r: 10, g: 10, b: 15 }
    }
  })
  .composite(composites)
  .toFile(outputPath);
}