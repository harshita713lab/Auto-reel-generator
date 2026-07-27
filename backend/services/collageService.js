const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// ============================================================
// ✅ MAIN EXPORTED FUNCTION - Create collages
// ============================================================
exports.createCollage = async (imagePaths, template) => {
  const collageImages = [];
  const width = template.width || 1080;
  const height = template.height || 1920;
  const imagesPerCollage = template.imagesPerCollage || 2;
  const collageType = template.collageType || 'grid';
  const gap = template.gap || 8;
  const blurBackground = template.blurBackground !== undefined ? template.blurBackground : true;

  // Group images into collage frames
  const collageGroups = [];
  for (let i = 0; i < imagePaths.length; i += imagesPerCollage) {
    const group = imagePaths.slice(i, i + imagesPerCollage);
    collageGroups.push(group);
  }

  console.log(`\n🧩 Creating ${collageGroups.length} collages (${collageType} type)`);

  for (let i = 0; i < collageGroups.length; i++) {
    const group = collageGroups[i];
    const outputName = `collage_${uuidv4()}.jpg`;
    const outputPath = path.join(path.dirname(group[0]), outputName);

    console.log(`   📸 Collage ${i+1}: ${group.length} images`);

    if (group.length === 1) {
      await createSingleImageCollage(group, outputPath, width, height, blurBackground);
    } else if (group.length === 2) {
      await createTwoImageCollage(group, outputPath, width, height, gap, blurBackground, collageType);
    } else if (group.length === 3) {
      await createThreeImageCollage(group, outputPath, width, height, gap, blurBackground);
    } else if (group.length === 4) {
      await createFourGridCollage(group, outputPath, width, height, gap, blurBackground);
    } else {
      await createMultiGridCollage(group, outputPath, width, height, gap, blurBackground);
    }

    collageImages.push(outputPath);
    console.log(`   ✅ Collage ${i+1} created: ${path.basename(outputPath)}`);
  }

  console.log(`✅ ${collageImages.length} collages created successfully`);
  return collageImages;
};

// ============================================================
// ✅ SINGLE IMAGE - Full with blur background
// ============================================================
async function createSingleImageCollage(images, outputPath, width, height, blurBackground) {
  if (blurBackground) {
    const blurredBg = await sharp(images[0])
      .resize(width, height, { fit: 'cover' })
      .blur(30)
      .modulate({ brightness: 0.5, saturation: 1.3 })
      .toBuffer();

    const mainImg = await sharp(images[0])
      .resize(Math.floor(width * 0.85), Math.floor(height * 0.75), { fit: 'cover' })
      .composite([{
        input: Buffer.from(
          `<svg width="${Math.floor(width * 0.85)}" height="${Math.floor(height * 0.75)}">
            <rect width="100%" height="100%" rx="20" fill="white" />
          </svg>`
        ),
        blend: 'dest-in'
      }])
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
      { input: blurredBg, left: 0, top: 0 },
      { input: mainImg, left: Math.floor(width * 0.075), top: Math.floor(height * 0.125) }
    ])
    .toFile(outputPath);
  } else {
    await sharp(images[0])
      .resize(width, height, { fit: 'cover' })
      .toFile(outputPath);
  }
}

// ============================================================
// ✅ 2 IMAGES - Vertical (Stacked) or Horizontal (Side by Side)
// ============================================================
async function createTwoImageCollage(images, outputPath, width, height, gap, blurBackground, collageType) {
  const isVertical = collageType === 'vertical';
  
  if (blurBackground) {
    const blurredBg = await sharp(images[0])
      .resize(width, height, { fit: 'cover' })
      .blur(30)
      .modulate({ brightness: 0.5, saturation: 1.3 })
      .toBuffer();

    if (isVertical) {
      // Vertical stack
      const halfHeight = Math.floor((height - gap * 3) / 2);
      const imgWidth = Math.floor(width * 0.9);
      
      const img1 = await sharp(images[0])
        .resize(imgWidth, halfHeight, { fit: 'cover' })
        .composite([{
          input: Buffer.from(
            `<svg width="${imgWidth}" height="${halfHeight}">
              <rect width="100%" height="100%" rx="16" fill="white" />
            </svg>`
          ),
          blend: 'dest-in'
        }])
        .toBuffer();

      const img2 = await sharp(images[1])
        .resize(imgWidth, halfHeight, { fit: 'cover' })
        .composite([{
          input: Buffer.from(
            `<svg width="${imgWidth}" height="${halfHeight}">
              <rect width="100%" height="100%" rx="16" fill="white" />
            </svg>`
          ),
          blend: 'dest-in'
        }])
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
        { input: blurredBg, left: 0, top: 0 },
        { input: img1, left: Math.floor((width - imgWidth) / 2), top: gap * 2 },
        { input: img2, left: Math.floor((width - imgWidth) / 2), top: gap * 2 + halfHeight + gap }
      ])
      .toFile(outputPath);
    } else {
      // Horizontal side by side
      const halfWidth = Math.floor((width - gap * 3) / 2);
      const imgHeight = Math.floor(height * 0.9);
      
      const img1 = await sharp(images[0])
        .resize(halfWidth, imgHeight, { fit: 'cover' })
        .composite([{
          input: Buffer.from(
            `<svg width="${halfWidth}" height="${imgHeight}">
              <rect width="100%" height="100%" rx="16" fill="white" />
            </svg>`
          ),
          blend: 'dest-in'
        }])
        .toBuffer();

      const img2 = await sharp(images[1])
        .resize(halfWidth, imgHeight, { fit: 'cover' })
        .composite([{
          input: Buffer.from(
            `<svg width="${halfWidth}" height="${imgHeight}">
              <rect width="100%" height="100%" rx="16" fill="white" />
            </svg>`
          ),
          blend: 'dest-in'
        }])
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
        { input: blurredBg, left: 0, top: 0 },
        { input: img1, left: gap * 2, top: Math.floor((height - imgHeight) / 2) },
        { input: img2, left: gap * 2 + halfWidth + gap, top: Math.floor((height - imgHeight) / 2) }
      ])
      .toFile(outputPath);
    }
  } else {
    // No blur background - simple layout
    if (isVertical) {
      const halfHeight = Math.floor((height - gap) / 2);
      const img1 = await sharp(images[0]).resize(width, halfHeight, { fit: 'cover' }).toBuffer();
      const img2 = await sharp(images[1]).resize(width, halfHeight, { fit: 'cover' }).toBuffer();
      
      await sharp({
        create: {
          width: width,
          height: height,
          channels: 3,
          background: { r: 10, g: 10, b: 15 }
        }
      })
      .composite([
        { input: img1, left: 0, top: 0 },
        { input: img2, left: 0, top: halfHeight + gap }
      ])
      .toFile(outputPath);
    } else {
      const halfWidth = Math.floor((width - gap) / 2);
      const img1 = await sharp(images[0]).resize(halfWidth, height, { fit: 'cover' }).toBuffer();
      const img2 = await sharp(images[1]).resize(halfWidth, height, { fit: 'cover' }).toBuffer();
      
      await sharp({
        create: {
          width: width,
          height: height,
          channels: 3,
          background: { r: 10, g: 10, b: 15 }
        }
      })
      .composite([
        { input: img1, left: 0, top: 0 },
        { input: img2, left: halfWidth + gap, top: 0 }
      ])
      .toFile(outputPath);
    }
  }
}

// ============================================================
// ✅ 3 IMAGES - Vertical Stack with blur background
// ============================================================
async function createThreeImageCollage(images, outputPath, width, height, gap, blurBackground) {
  if (blurBackground) {
    const blurredBg = await sharp(images[0])
      .resize(width, height, { fit: 'cover' })
      .blur(30)
      .modulate({ brightness: 0.5, saturation: 1.3 })
      .toBuffer();

    const thirdHeight = Math.floor((height - gap * 4) / 3);
    const imgWidth = Math.floor(width * 0.9);

    const imagesBuffer = await Promise.all(
      images.map(async (img) => {
        return await sharp(img)
          .resize(imgWidth, thirdHeight, { fit: 'cover' })
          .composite([{
            input: Buffer.from(
              `<svg width="${imgWidth}" height="${thirdHeight}">
                <rect width="100%" height="100%" rx="16" fill="white" />
              </svg>`
            ),
            blend: 'dest-in'
          }])
          .toBuffer();
      })
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
      { input: blurredBg, left: 0, top: 0 },
      { input: imagesBuffer[0], left: Math.floor((width - imgWidth) / 2), top: gap * 2 },
      { input: imagesBuffer[1], left: Math.floor((width - imgWidth) / 2), top: gap * 2 + thirdHeight + gap },
      { input: imagesBuffer[2], left: Math.floor((width - imgWidth) / 2), top: gap * 2 + (thirdHeight + gap) * 2 }
    ])
    .toFile(outputPath);
  } else {
    const thirdHeight = Math.floor((height - gap * 2) / 3);
    const imagesBuffer = await Promise.all(
      images.map(img => sharp(img).resize(width, thirdHeight, { fit: 'cover' }).toBuffer())
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
      { input: imagesBuffer[0], left: 0, top: 0 },
      { input: imagesBuffer[1], left: 0, top: thirdHeight + gap },
      { input: imagesBuffer[2], left: 0, top: (thirdHeight + gap) * 2 }
    ])
    .toFile(outputPath);
  }
}

// ============================================================
// ✅ 4 IMAGES - 2x2 Grid with blur background
// ============================================================
async function createFourGridCollage(images, outputPath, width, height, gap, blurBackground) {
  const halfWidth = Math.floor((width - gap * 3) / 2);
  const halfHeight = Math.floor((height - gap * 3) / 2);

  let blurredBg = null;
  if (blurBackground) {
    blurredBg = await sharp(images[0])
      .resize(width, height, { fit: 'cover' })
      .blur(30)
      .modulate({ brightness: 0.5, saturation: 1.3 })
      .toBuffer();
  }

  const imagesBuffer = await Promise.all(
    images.map(async (img) => {
      return await sharp(img)
        .resize(halfWidth, halfHeight, { fit: 'cover' })
        .composite([{
          input: Buffer.from(
            `<svg width="${halfWidth}" height="${halfHeight}">
              <rect width="100%" height="100%" rx="12" fill="white" />
            </svg>`
          ),
          blend: 'dest-in'
        }])
        .toBuffer();
    })
  );

  const composites = [];
  if (blurredBg) {
    composites.push({ input: blurredBg, left: 0, top: 0 });
  }

  composites.push(
    { input: imagesBuffer[0], left: gap * 2, top: gap * 2 },
    { input: imagesBuffer[1], left: gap * 2 + halfWidth + gap, top: gap * 2 },
    { input: imagesBuffer[2], left: gap * 2, top: gap * 2 + halfHeight + gap },
    { input: imagesBuffer[3], left: gap * 2 + halfWidth + gap, top: gap * 2 + halfHeight + gap }
  );

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

// ============================================================
// ✅ 5+ IMAGES - Multi grid (2 columns)
// ============================================================
async function createMultiGridCollage(images, outputPath, width, height, gap, blurBackground) {
  const numImages = images.length;
  const cols = 2;
  const rows = Math.ceil(numImages / cols);
  
  const cellWidth = Math.floor((width - gap * (cols + 3)) / cols);
  const cellHeight = Math.floor((height - gap * (rows + 3)) / rows);

  let blurredBg = null;
  if (blurBackground) {
    blurredBg = await sharp(images[0])
      .resize(width, height, { fit: 'cover' })
      .blur(30)
      .modulate({ brightness: 0.5, saturation: 1.3 })
      .toBuffer();
  }

  const composites = [];
  if (blurredBg) {
    composites.push({ input: blurredBg, left: 0, top: 0 });
  }

  for (let i = 0; i < numImages; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const left = gap * 2 + col * (cellWidth + gap);
    const top = gap * 2 + row * (cellHeight + gap);

    const imgBuffer = await sharp(images[i])
      .resize(cellWidth, cellHeight, { fit: 'cover' })
      .composite([{
        input: Buffer.from(
          `<svg width="${cellWidth}" height="${cellHeight}">
            <rect width="100%" height="100%" rx="12" fill="white" />
          </svg>`
        ),
        blend: 'dest-in'
      }])
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