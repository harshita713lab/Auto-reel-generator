const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Create collages from multiple images - VERTICAL
 */
exports.createCollage = async (imagePaths, template) => {
  const collageImages = [];
  const width = template.width || 1080;
  const height = template.height || 1920;
  const imagesPerCollage = template.imagesPerCollage || 2;
  const collageType = template.collageType || 'vertical';

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
      // ✅ 1 image - full vertical
      await sharp(group[0])
        .resize(width, height, { fit: 'cover' })
        .toFile(outputPath);
    } else if (group.length === 2) {
      // ✅ 2 images - vertical stack (2 rows)
      await createVerticalTwoCollage(group, outputPath, width, height);
    } else if (group.length === 3) {
      // ✅ 3 images - vertical stack (3 rows)
      await createVerticalThreeCollage(group, outputPath, width, height);
    } else if (group.length === 4) {
      // ✅ 4 images - 2x2 grid
      await createFourGridCollage(group, outputPath, width, height);
    } else if (group.length >= 5) {
      // ✅ 5+ images - 2 columns grid
      await createVerticalMultiCollage(group, outputPath, width, height);
    }

    collageImages.push(outputPath);
  }

  return collageImages;
};

// ============================================================
// ✅ 2 IMAGES - VERTICAL STACK (50% each) with gap
// ============================================================
async function createVerticalTwoCollage(images, outputPath, width, height) {
  const gap = 4;
  const halfHeight = Math.floor((height - gap) / 2);
  
  const img1 = await sharp(images[0])
    .resize(width - gap * 2, halfHeight, { fit: 'cover' })
    .toBuffer();
  
  const img2 = await sharp(images[1])
    .resize(width - gap * 2, halfHeight, { fit: 'cover' })
    .toBuffer();
  
  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 10, g: 10, b: 15 }
    }
  })
  .composite([
    { input: img1, left: gap, top: gap },
    { input: img2, left: gap, top: gap + halfHeight + gap }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 3 IMAGES - VERTICAL STACK (33.33% each) with gap
// ============================================================
async function createVerticalThreeCollage(images, outputPath, width, height) {
  const gap = 4;
  const thirdHeight = Math.floor((height - gap * 2) / 3);
  
  const imagesBuffer = await Promise.all(
    images.map(img => sharp(img).resize(width - gap * 2, thirdHeight, { fit: 'cover' }).toBuffer())
  );
  
  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 10, g: 10, b: 15 }
    }
  })
  .composite([
    { input: imagesBuffer[0], left: gap, top: gap },
    { input: imagesBuffer[1], left: gap, top: gap + thirdHeight + gap },
    { input: imagesBuffer[2], left: gap, top: gap + (thirdHeight + gap) * 2 }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 4 IMAGES - 2x2 GRID with gap
// ============================================================
async function createFourGridCollage(images, outputPath, width, height) {
  const gap = 4;
  const halfWidth = Math.floor((width - gap) / 2);
  const halfHeight = Math.floor((height - gap) / 2);
  
  const imagesBuffer = await Promise.all(
    images.map(img => sharp(img).resize(halfWidth - gap, halfHeight - gap, { fit: 'cover' }).toBuffer())
  );
  
  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 10, g: 10, b: 15 }
    }
  })
  .composite([
    // Row 1
    { input: imagesBuffer[0], left: gap, top: gap },
    { input: imagesBuffer[1], left: gap + halfWidth, top: gap },
    // Row 2
    { input: imagesBuffer[2], left: gap, top: gap + halfHeight },
    { input: imagesBuffer[3], left: gap + halfWidth, top: gap + halfHeight }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 5+ IMAGES - 2 COLUMNS VERTICAL GRID with gap
// ============================================================
async function createVerticalMultiCollage(images, outputPath, width, height) {
  const numImages = images.length;
  const cols = 2;
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
      .resize(cellWidth - gap, cellHeight - gap, { fit: 'cover' })
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