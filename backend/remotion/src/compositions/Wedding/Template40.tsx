import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ======================================================
// CONFIG & TYPES (TOTAL IMAGES: 11)
// ======================================================
export const FPS = 30;
export const DURATION_IN_FRAMES = 600; // Total 20 seconds (20 * 30)
export const IMAGE_COUNT = 11;
const TOTAL_IMAGES_COUNT = 11; // Strict 11 Images configuration

const SCENE1_DURATION = 180; // 0 to 5 seconds
const SCENE2_DURATION = 210; // 5 to 12 seconds
const SCENE3_DURATION = 90;  // 12 to 15 seconds
// Scene 4 runs from 15 to 20 seconds (Frames 450 to 600 = 150 frames)

interface ImageItem {
  path: string;
}

interface TemplateProps {
  images?: ImageItem[];
}

// Exactly 11 default images configuration
const DEFAULT_IMAGES = Array.from({ length: TOTAL_IMAGES_COUNT }, (_, i) => ({
  path: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
}));

// Perfectly balanced equal gaps grid positions for 11 images
const GRID_POSITIONS = [
  { left: "74%", top: "28%", width: "21%", height: "13%" },
  { left: "51%", top: "42%", width: "21%", height: "13%" },
  { left: "74%", top: "42%", width: "21%", height: "13%" },
  { left: "28%", top: "56%", width: "21%", height: "13%" },
  { left: "51%", top: "56%", width: "21%", height: "13%" },
  { left: "74%", top: "56%", width: "21%", height: "13%" },
  { left: "5%",  top: "70%", width: "21%", height: "13%" },
  { left: "28%", top: "70%", width: "21%", height: "13%" },
  { left: "51%", top: "70%", width: "21%", height: "13%" },
  { left: "74%", top: "70%", width: "21%", height: "13%" },
  { left: "51%", top: "28%", width: "21%", height: "13%" },
];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ======================================================
// MAIN 20-SECOND MASTER COMPONENT
// ======================================================

export const CompleteReelTemplate: React.FC<TemplateProps> = ({ images }) => {
  const frame = useCurrentFrame();
  const safeImages = images && images.length >= TOTAL_IMAGES_COUNT ? images : DEFAULT_IMAGES;
  const sharedImages = safeImages.slice(0, TOTAL_IMAGES_COUNT);

  const s1End = SCENE1_DURATION;
  const s2End = s1End + SCENE2_DURATION;
  const s3End = s2End + SCENE3_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* SCENE 1: Grid Build-up (0s to 5s) - Uses 11 Images with equal gap */}
      {frame < s1End && (
        <Scene1Grid images={sharedImages} frame={frame} />
      )}

      {/* SCENE 2: Polaroid Showcase (5s to 12s) - Uses 11 Images with bigger card size */}
      {frame >= s1End && frame < s2End && (
        <Scene2Polaroid images={sharedImages} frame={frame - s1End} />
      )}

      {/* SCENE 3: Fast Render / Beat Sync (12s to 15s) - Uses 11 Images */}
      {frame >= s2End && frame < s3End && (
        <Scene3FastRender images={sharedImages} frame={frame - s2End} />
      )}

      {/* SCENE 4: Camcorder Viewfinder Snapshots (15s to 20s) - Uses 11 Images */}
      {frame >= s3End && (
        <Scene4Camcorder images={sharedImages} frame={frame - s3End} />
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 1 SUB-COMPONENT (11 Images Grid with Equal Gaps)
// ======================================================
const Scene1Grid: React.FC<{ images: ImageItem[]; frame: number }> = ({ images, frame }) => {
  const bgScale = interpolate(frame, [0, SCENE1_DURATION], [1.02, 1.20], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill>
        <Img
          src={images[0]?.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            filter: "blur(16px) brightness(0.6)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.35)" }} />
      </AbsoluteFill>

      <div style={{ position: "absolute", top: "42%", left: "10%", zIndex: 50 }}>
        <span
          style={{
            fontFamily: "Brush Script MT, cursive, sans-serif",
            fontSize: "52px",
            color: "#ffffff",
            fontStyle: "italic",
            textShadow: "0 4px 15px rgba(0,0,0,0.8)",
          }}
        >
          My Love
        </span>
      </div>

      {GRID_POSITIONS.map((pos, index) => {
        const entryDelay = index * 8;
        const localFrame = frame - entryDelay;

        const opacity = interpolate(localFrame, [0, 10], [0, 1], clamp);
        const scale = interpolate(localFrame, [0, 15], [0.5, 1], {
          ...clamp,
          easing: Easing.out(Easing.back(1.5)),
        });

        if (localFrame < 0) return null;

        const imgData = images[index]?.path || images[0]?.path;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
              opacity,
              transform: `scale(${scale})`,
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              border: "2px solid rgba(255, 255, 255, 0.8)",
              backgroundColor: "#fff",
              zIndex: 20 + index,
            }}
          >
            <Img src={imgData} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2 SUB-COMPONENT (Bigger Polaroid Card Size)
// ======================================================
const Scene2Polaroid: React.FC<{
  images: ImageItem[];
  frame: number;
}> = ({ images, frame }) => {

  // Only first 10 images
  const scene2Images = images.slice(0, 10);

  if (scene2Images.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }} />
    );
  }

  // 180 frames / 10 images = 18 frames per image
  const framesPerImage = Math.max(
    1,
    Math.floor(SCENE2_DURATION / scene2Images.length)
  );

  const currentIndex = Math.min(
    Math.floor(frame / framesPerImage),
    scene2Images.length - 1
  );

  const localFrame = frame % framesPerImage;

  const currentImage =
    scene2Images[currentIndex]?.path ||
    scene2Images[0]?.path;

  // Background zoom
  const bgScale = interpolate(
    localFrame,
    [0, framesPerImage - 1],
    [1.05, 1.12],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Only image fades
  const imageOpacity = interpolate(
    localFrame,
    [0, 5, 10],
    [0, 1, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.quad),
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >

      {/* BACKGROUND */}
      <AbsoluteFill>
        <Img
          src={currentImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            filter: "blur(18px) brightness(0.55)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
          }}
        />
      </AbsoluteFill>

      {/* FIXED CARD */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
  <div
  style={{
    width: "94%",
    maxWidth: "960px",

    backgroundColor: "#fff",

    padding: "28px 28px 55px 28px",

    borderRadius: "20px",

    boxShadow: "0 35px 80px rgba(0,0,0,0.65)",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    boxSizing: "border-box",
  }}
>
  {/* IMAGE */}
  <div
    style={{
      width: "100%",

      // 👇 image height increased
      aspectRatio: "1 / 1.05",

      overflow: "hidden",
      borderRadius: "10px",

      opacity: imageOpacity,
    }}
  >
    <Img
      src={currentImage}
      style={{
        width: "100%",
        height: "100%",

        objectFit: "cover",

        display: "block",
      }}
    />
  </div>

  {/* TEXT */}
  <div
    style={{
      width: "100%",

      marginTop: "26px",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      gap: "14px",

      whiteSpace: "nowrap",
    }}
  >
    <span
      style={{
        fontSize: "30px",
      }}
    >
      💋
    </span>

    <span
      style={{
        fontSize: "38px",
        fontWeight: 900,
        letterSpacing: "3px",
        color: "#000",
      }}
    >
      I LOVE YOU
    </span>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <span style={{ fontSize: "28px" }}>
        ❤️
      </span>

      <span style={{ fontSize: "20px" }}>
        ❤️
      </span>
    </div>
  </div>
</div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3 SUB-COMPONENT (Fast Render - 11 Images)
// ======================================================
const Scene3FastRender: React.FC<{ images: ImageItem[]; frame: number }> = ({ images, frame }) => {
  const framesPerImage = 8; 
  const currentIndex = Math.floor(frame / framesPerImage) % images.length;
  const currentImage = images[currentIndex]?.path || images[0]?.path;

  const localFrame = frame % framesPerImage;
  const scale = interpolate(localFrame, [0, framesPerImage], [1.1, 1.0], clamp);
  const opacity = interpolate(localFrame, [0, 3], [0.6, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill>
        <Img
          src={currentImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(20px) brightness(0.5)",
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          width: "82%",
          height: "75%",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
          border: "4px solid rgba(255,255,255,0.9)",
          opacity,
          position: "relative",
        }}
      >
        <Img
          src={currentImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 4 SUB-COMPONENT (Camcorder Viewfinder - 11 Images)
// ======================================================
// ======================================================
// SCENE 4 SUB-COMPONENT
// CAMCORDER VIEWFINDER - 11 IMAGES / 5 SECONDS
// ======================================================

const Scene4Camcorder: React.FC<{
  images: ImageItem[];
  frame: number;
}> = ({ images, frame }) => {
  // --------------------------------------------------
  // CONFIG
  // --------------------------------------------------

  const sceneDuration = 150; // 5 seconds @ 30 FPS

  const safeImages =
    images && images.length > 0 ? images : [];

  // Safety fallback
  if (safeImages.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
        }}
      />
    );
  }

  // --------------------------------------------------
  // IMAGE TIMING
  // --------------------------------------------------

  const framesPerImage = Math.max(
    1,
    Math.floor(
      sceneDuration / safeImages.length
    )
  );

  const currentIndex = Math.min(
    Math.floor(frame / framesPerImage),
    safeImages.length - 1
  );

  const currentImage =
    safeImages[currentIndex]?.path ||
    safeImages[0]?.path;

  // Frame inside current image
  const localFrame =
    frame - currentIndex * framesPerImage;

  // --------------------------------------------------
  // SAFE TIMING
  // --------------------------------------------------

  // With 11 images:
  // 150 / 11 = 13 frames approximately
  //
  // Entry = max 4 frames
  // Remaining frames = zoom out

  const ENTRY_FRAMES = Math.min(
    4,
    Math.max(1, framesPerImage - 2)
  );

  const ZOOM_START_FRAME = ENTRY_FRAMES;

  const ZOOM_END_FRAME = Math.max(
    ZOOM_START_FRAME + 1,
    framesPerImage - 1
  );

  // --------------------------------------------------
  // ALTERNATING SNAP DIRECTION
  // --------------------------------------------------

  const direction =
    currentIndex % 2 === 0 ? 1 : -1;

  // --------------------------------------------------
  // ENTRY PROGRESS
  // --------------------------------------------------

  const entryProgress = Math.min(
    localFrame / ENTRY_FRAMES,
    1
  );

  // --------------------------------------------------
  // SNAP X MOVEMENT
  // --------------------------------------------------

  let entryX = 0;

  if (localFrame < ENTRY_FRAMES) {
    entryX = interpolate(
      localFrame,
      [0, 1, 2, 3, ENTRY_FRAMES],
      [
        direction * 110,
        direction * -28,
        direction * 12,
        direction * -3,
        0,
      ],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      }
    );
  }

  // --------------------------------------------------
  // ENTRY ROTATION
  // --------------------------------------------------

  let entryRotate = 0;

  if (localFrame < ENTRY_FRAMES) {
    entryRotate = interpolate(
      localFrame,
      [0, 1, 2, 3, ENTRY_FRAMES],
      [
        direction * 3.5,
        direction * -1.5,
        direction * 0.7,
        direction * -0.2,
        0,
      ],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      }
    );
  }

  // --------------------------------------------------
  // SCALE
  //
  // Entry:
  // 1.08 -> 0.98 -> 1
  //
  // Then:
  // 1 -> 0.96
  // --------------------------------------------------

  let imageScale = 1;

  if (localFrame < ENTRY_FRAMES) {
    imageScale = interpolate(
      localFrame,
      [0, 1, 2, ENTRY_FRAMES],
      [1.08, 0.98, 1.02, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      }
    );
  } else {
    imageScale = interpolate(
      localFrame,
      [ZOOM_START_FRAME, ZOOM_END_FRAME],
      [1, 0.96],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  // --------------------------------------------------
  // SMALL HANDHELD CAMERA MOVEMENT
  // --------------------------------------------------

  const handheldX =
    localFrame >= ENTRY_FRAMES
      ? Math.sin(localFrame * 0.35) * 1.2
      : 0;

  const handheldY =
    localFrame >= ENTRY_FRAMES
      ? Math.cos(localFrame * 0.28) * 0.8
      : 0;

  const handheldRotate =
    localFrame >= ENTRY_FRAMES
      ? Math.sin(localFrame * 0.18) * 0.12
      : 0;

  // --------------------------------------------------
  // IMAGE OPACITY
  // --------------------------------------------------

  const imageOpacity = interpolate(
    localFrame,
    [0, 2, ENTRY_FRAMES],
    [0.75, 1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // --------------------------------------------------
  // REC BLINK
  // --------------------------------------------------

  const isRecBlinking =
    Math.floor(frame / 15) % 2 === 0;

  // --------------------------------------------------
  // FINAL TRANSFORM
  // --------------------------------------------------

  const imageTransform = `
    translateX(${entryX + handheldX}px)
    translateY(${handheldY}px)
    rotate(${entryRotate + handheldRotate}deg)
    scale(${imageScale})
  `;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          MAIN IMAGE
      ================================================== */}

      <AbsoluteFill
        style={{
          overflow: "hidden",
          opacity: imageOpacity,
          transform: imageTransform,
        }}
      >
        <Img
          src={currentImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </AbsoluteFill>

      {/* ==================================================
          DARK CAMERA VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* ==================================================
          CAMCORDER UI
      ================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          fontFamily: "monospace",
          color: "rgba(255,255,255,0.88)",
        }}
      >
        {/* ==================================================
            TOP LEFT
        ================================================== */}

        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            fontSize: 15,
            lineHeight: 1.45,
            transform: "rotate(-90deg)",
            transformOrigin: "top left",
            opacity: 0.9,
          }}
        >
          <div>HQ 1080/60p</div>

          <div
            style={{
              fontSize: 11,
              opacity: 0.75,
            }}
          >
            0dB III
          </div>
        </div>

        {/* ==================================================
            TOP RIGHT
        ================================================== */}

        <div
          style={{
            position: "absolute",
            top: 30,
            right: 30,
            textAlign: "right",
            fontSize: 15,
            transform: "rotate(90deg)",
            transformOrigin: "top right",
          }}
        >
          <div>180min</div>

          <div
            style={{
              marginTop: 5,
              fontSize: 24,
            }}
          >
            ▯
          </div>
        </div>

        {/* ==================================================
            TOP LEFT CORNER
        ================================================== */}

        <div
          style={{
            position: "absolute",
            top: 25,
            left: 25,
            width: 125,
            height: 65,
            borderTop:
              "3px solid rgba(255,255,255,0.7)",
            borderLeft:
              "3px solid rgba(255,255,255,0.7)",
            transform: "rotate(-2deg)",
          }}
        />

        {/* ==================================================
            TOP RIGHT CORNER
        ================================================== */}

        <div
          style={{
            position: "absolute",
            top: 25,
            right: 25,
            width: 125,
            height: 65,
            borderTop:
              "3px solid rgba(255,255,255,0.7)",
            borderRight:
              "3px solid rgba(255,255,255,0.7)",
            transform: "rotate(2deg)",
          }}
        />

        {/* ==================================================
            BOTTOM LEFT CORNER
        ================================================== */}

        <div
          style={{
            position: "absolute",
            bottom: 25,
            left: 25,
            width: 125,
            height: 65,
            borderBottom:
              "3px solid rgba(255,255,255,0.55)",
            borderLeft:
              "3px solid rgba(255,255,255,0.55)",
            transform: "rotate(2deg)",
          }}
        />

        {/* ==================================================
            BOTTOM RIGHT CORNER
        ================================================== */}

        <div
          style={{
            position: "absolute",
            bottom: 25,
            right: 25,
            width: 125,
            height: 65,
            borderBottom:
              "3px solid rgba(255,255,255,0.55)",
            borderRight:
              "3px solid rgba(255,255,255,0.55)",
            transform: "rotate(-2deg)",
          }}
        />

        {/* ==================================================
            BOTTOM LEFT EXPOSURE
        ================================================== */}

        <div
          style={{
            position: "absolute",
            bottom: 125,
            left: 28,
            fontSize: 13,
            opacity: 0.8,
            transform: "rotate(-90deg)",
            transformOrigin: "bottom left",
          }}
        >
          0dB
        </div>

        {/* ==================================================
            REC INDICATOR
        ================================================== */}

        <div
          style={{
            position: "absolute",
            bottom: 120,
            right: 30,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              backgroundColor: "#ff1a1a",
              opacity: isRecBlinking
                ? 1
                : 0.2,
              boxShadow: isRecBlinking
                ? "0 0 10px rgba(255,0,0,0.7)"
                : "none",
            }}
          />

          <span>REC</span>
        </div>

        {/* ==================================================
            CENTER BOTTOM CAMERA CONTROLS
        ================================================== */}

        <div
          style={{
            position: "absolute",
            bottom: 45,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 30,
            fontSize: 15,
            opacity: 0.9,
          }}
        >
          <span>10</span>

          <span
            style={{
              fontSize: 30,
              lineHeight: 1,
            }}
          >
            ▶
          </span>

          <span>30</span>
        </div>

        {/* ==================================================
            WATERMARK
        ================================================== */}

        <div
          style={{
            position: "absolute",
            bottom: 82,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 18,
            opacity: 0.5,
            letterSpacing: 1,
          }}
        >
          ©Divine
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default CompleteReelTemplate;