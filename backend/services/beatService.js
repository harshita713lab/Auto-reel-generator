const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Create collages with multiple layout options
 * Supports: 2-image, 3-image, 4-image, grid, circle, vertical
 */
exports.createCollage = async (imagePaths, template) => {
  const collageImages = [];
  const width = template.width || 1080;
  const height = template.height || 1920;
  const collageType = template.collageType || 'vertical';
  const imagesPerCollage = template.imagesPerCollage || 3;
  const gap = template.gap || 10;

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
      // ✅ TUMHARA: Horizontal split (side by side)
      await createHorizontalCollage(group, outputPath, width, height);
    } else if (group.length === 3) {
      // ✅ TUMHARA: Row-wise (3 horizontal strips)
      if (collageType === 'three' || collageType === 'vertical') {
        await createThreeRowCollage(group, outputPath, width, height, gap);
      } else if (collageType === 'circle') {
        // ✅ TANISHA: Circle collage
        await createCircleThreeCollage(group, outputPath, width, height, gap);
      } else {
        // Default: vertical
        await createVerticalThreeCollage(group, outputPath, width, height, gap);
      }
    } else if (group.length === 4) {
      // ✅ TANISHA: Grid with gaps
      await createGridCollage(group, outputPath, width, height, 2, 2, gap);
    } else {
      // ✅ TANISHA: Dynamic grid for any number of images
      const cols = Math.min(3, group.length);
      const rows = Math.ceil(group.length / cols);
      await createGridCollage(group, outputPath, width, height, cols, rows, gap);
    }

    collageImages.push(outputPath);
  }

  // Return collage images (they will be used in the video)
  return collageImages;
};

// ============================================================
// ✅ 2 IMAGES - SIDE BY SIDE HORIZONTAL (TUMHARA)
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
    create: { width, height, channels: 3, background: { r: 0, g: 0, b: 0 } }
  })
  .composite([
    { input: leftImage, left: 0, top: 0 },
    { input: rightImage, left: halfWidth, top: 0 }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 3 IMAGES - ROW-WISE (TUMHARA - 3 horizontal strips)
// ============================================================
async function createThreeRowCollage(images, outputPath, width, height, gap = 20) {
  const thirdHeight = Math.floor(height / 3);
  
  const img1 = await sharp(images[0])
    .resize(width, thirdHeight, { fit: 'cover' })
    .toBuffer();
  
  const img2 = await sharp(images[1])
    .resize(width, thirdHeight, { fit: 'cover' })
    .toBuffer();
  
  const img3 = await sharp(images[2])
    .resize(width, thirdHeight, { fit: 'cover' })
    .toBuffer();
  
  await sharp({
    create: { width, height, channels: 3, background: { r: 15, g: 15, b: 15 } }
  })
  .composite([
    { input: img1, left: 0, top: 0 },
    { input: img2, left: 0, top: thirdHeight },
    { input: img3, left: 0, top: thirdHeight * 2 }
  ])
  .toFile(outputPath);
}

// ============================================================
// ✅ 3 IMAGES - VERTICAL WITH GAPS (TANISHA)
// ============================================================
async function createVerticalThreeCollage(images, outputPath, width, height, gap = 10) {
  const totalGaps = gap * 2;
  const eachHeight = Math.floor((height - totalGaps) / 3);
  
  console.log(`📐 Creating vertical 3-collage: ${width}x${height}, each ${eachHeight}px, gap ${gap}px`);
  
  const imageBuffers = await Promise.all(
    images.map(img => 
      sharp(img)
        .resize(width, eachHeight, { fit: 'cover' })
        .toBuffer()
    )
  );
  
  const composites = imageBuffers.map((buffer, index) => ({
    input: buffer,
    left: 0,
    top: index * (eachHeight + gap)
  }));
  
  await sharp({
    create: { width, height, channels: 3, background: { r: 0, g: 0, b: 0 } }
  })
  .composite(composites)
  .toFile(outputPath);
  
  console.log(`✅ Vertical 3-collage created with ${images.length} images`);
}

// ============================================================
// ✅ GRID COLLAGE (TANISHA - with gaps)
// ============================================================
async function createGridCollage(images, outputPath, width, height, cols, rows, gap = 8) {
  const cellWidth = Math.floor((width - gap * (cols - 1)) / cols);
  const cellHeight = Math.floor((height - gap * (rows - 1)) / rows);
  
  const composites = [];
  const totalImages = Math.min(images.length, cols * rows);
  
  for (let i = 0; i < totalImages; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const left = col * (cellWidth + gap);
    const top = row * (cellHeight + gap);
    
    const imgBuffer = await sharp(images[i])
      .resize(cellWidth, cellHeight, { fit: 'cover' })
      .toBuffer();
    
    composites.push({ input: imgBuffer, left, top });
  }
  
  await sharp({
    create: { width, height, channels: 3, background: { r: 0, g: 0, b: 0 } }
  })
  .composite(composites)
  .toFile(outputPath);
}

// ============================================================
// ✅ CIRCLE COLLAGE (TANISHA)
// ============================================================
exports.createCircleCollage = async (imagePaths, template) => {
  const collageImages = [];
  const width = template.width || 1080;
  const height = template.height || 1920;
  const imagesPerCollage = template.imagesPerCollage || 3;
  const gap = template.gap || 20;

  // Group images
  const collageGroups = [];
  for (let i = 0; i < imagePaths.length; i += imagesPerCollage) {
    const group = imagePaths.slice(i, i + imagesPerCollage);
    collageGroups.push(group);
  }

  for (let i = 0; i < collageGroups.length; i++) {
    const group = collageGroups[i];
    const outputName = `circle_collage_${uuidv4()}.png`;
    const outputPath = path.join(path.dirname(group[0]), outputName);

    if (group.length === 3) {
      await createCircleThreeCollage(group, outputPath, width, height, gap);
    } else {
      // Fallback to vertical
      await createVerticalThreeCollage(group, outputPath, width, height, gap);
    }

    collageImages.push(outputPath);
  }

  return collageImages;
};

// ============================================================
// ✅ 3 IMAGES IN CIRCLE STYLE (TANISHA)
// ============================================================
async function createCircleThreeCollage(images, outputPath, width, height, gap = 20) {
  // ✅ Ensure integer values using Math.floor()
  const circleSize = Math.floor(Math.min(width * 0.85, (height - gap * 4) / 3));
  const radius = Math.floor(circleSize / 2);
  const centerX = Math.floor(width / 2);
  const startY = Math.floor((height - (circleSize * 3 + gap * 2)) / 2);
  
  console.log(`⭕ Creating circle collage: ${width}x${height}, circleSize: ${circleSize}px`);
  
  // ✅ Create circular images
  const circleImages = await Promise.all(
    images.map(async (img) => {
      // Resize to square
      const squared = await sharp(img)
        .resize(circleSize, circleSize, { fit: 'cover' })
        .toBuffer();
      
      // ✅ SVG circle mask
      const svg = `<svg width="${circleSize}" height="${circleSize}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="white"/></svg>`;
      const mask = await sharp(Buffer.from(svg)).png().toBuffer();
      
      // Apply mask
      return await sharp(squared)
        .composite([{
          input: mask,
          left: 0,
          top: 0,
          blend: 'dest-in'
        }])
        .png()
        .toBuffer();
    })
  );

  // ✅ Composite all circles
  const composites = circleImages.map((buffer, index) => ({
    input: buffer,
    left: Math.floor((width - circleSize) / 2),
    top: startY + index * (circleSize + gap)
  }));

  await sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite(composites)
  .png()
  .toFile(outputPath);
  
  console.log(`✅ Circle collage created with ${images.length} images`);
}

// ============================================================
// ✅ 4 IMAGES - 2x2 GRID WITH GAPS (TANISHA - Better than tumhara)
// ============================================================
async function createFourGridCollage(images, outputPath, width, height, gap = 8) {
  await createGridCollage(images, outputPath, width, height, 2, 2, gap);
}