import React from "react";
import { staticFile } from "remotion";
import { 
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate } from "remotion";
import { MusicPlayer } from "../../components";
// ======================================================
// INTERFACE
// ======================================================

interface ImageItem {
  path: string;
  
}

interface Template3Props {
  images?: ImageItem[];
  music?:string;
}

export const IMAGE_COUNT = 11;

export const DURATION_IN_FRAMES = 480;

export const DEFAULT_PROPS = {images: [],};



// ======================================================
// SCENE 1
// 0s → 6s
//
// images[0]     = Background
// images[1-6]   = Left Slider
// ======================================================

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  // ====================================================
  // BACKGROUND IMAGE
  // ====================================================

  const backgroundImage = images[0];

  // ====================================================
  // LEFT SLIDER
  // ====================================================

  const sliderImages = images
    .slice(1, 7)
    .filter((img) => img?.path);

  // ====================================================
  // SLIDER SETTINGS
  // ====================================================

  const CARD_WIDTH = 340;
  const CARD_HEIGHT = 250;

  const GAP = 18;

  const STEP = CARD_HEIGHT + GAP;

  const SPEED = 1.2;

  // ====================================================
  // SLIDER MOVEMENT
  // ====================================================

  const sliderHeight = sliderImages.length * STEP;

  const translateY =
    sliderImages.length > 0
      ? -((frame * SPEED) % sliderHeight)
      : 0;

  // ====================================================
  // CARD COMPONENT
  // ====================================================

const renderCard = (img: ImageItem, key: string) => {
  const imageSrc =
    typeof img === "string"
      ? img
      : img?.path || (img as any)?.url;

  // Agar image source nahi hai to card render hi mat karo
  if (!imageSrc) {
    return null;
  }

  return (
    <div
      key={key}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,

        padding: 10,
        boxSizing: "border-box",

        backgroundColor: "rgba(245, 245, 245, 0.97)",

        borderRadius: 12,

        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",

        overflow: "hidden",

        flexShrink: 0,

        position: "relative",
      }}
    >
      <Img
        src={imageSrc}
        style={{
          width: "100%",
          height: "100%",

          objectFit: "cover",

          // Face ko thoda priority
          objectPosition: "center 30%",

          borderRadius: 7,

          display: "block",
        }}
      />
    </div>
  );
};
  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        backgroundColor: "#111",

        overflow: "hidden",
      }}
    >

      {/* ==================================================
          FULL SCREEN BACKGROUND
      ================================================== */}

      <AbsoluteFill>

        {backgroundImage?.path && (
          <Img
            src={backgroundImage.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",
              objectPosition: "center",

              display: "block",
            }}
          />
        )}

        {/* DARK OVERLAY */}

        <AbsoluteFill
          style={{
            backgroundColor: "rgba(0,0,0,0.28)",
          }}
        />

      </AbsoluteFill>


      {/* ==================================================
          💗 LARGE HEART 1
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: 410,
          top: 180,

          zIndex: 5,

          fontSize: 180,

          lineHeight: 1,

          color: "rgba(255, 182, 193, 0.55)",

          fontFamily: "Arial, sans-serif",

          textShadow:
            "0 0 12px rgba(255,182,193,0.9), 0 0 35px rgba(255,182,193,0.55)",

          transform: "rotate(-12deg)",

          pointerEvents: "none",
        }}
      >
        ♡
      </div>


      {/* ==================================================
          💗 LARGE HEART 2
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: 700,
          top: 420,

          zIndex: 5,

          fontSize: 125,

          lineHeight: 1,

          color: "rgba(255, 182, 193, 0.48)",

          fontFamily: "Arial, sans-serif",

          textShadow:
            "0 0 10px rgba(255,182,193,0.85), 0 0 28px rgba(255,182,193,0.5)",

          transform: "rotate(14deg)",

          pointerEvents: "none",
        }}
      >
        ♡
      </div>


      {/* ==================================================
          💗 SMALL HEART 3
          अलग जगह पर — overlap नहीं करेगा
      ================================================== */}

      <div
        style={{
          position: "absolute",

          left: 470,
          top: 650,

          zIndex: 5,

          fontSize: 75,

          lineHeight: 1,

          color: "rgba(255, 182, 193, 0.38)",

          fontFamily: "Arial, sans-serif",

          textShadow:
            "0 0 8px rgba(255,182,193,0.7), 0 0 20px rgba(255,182,193,0.4)",

          transform: "rotate(-8deg)",

          pointerEvents: "none",
        }}
      >
        ♡
      </div>
      {/* ==================================================
    💗 HEART 4
================================================== */}
{/* ==================================================
    💗 HEART 4
================================================== */}

<div
  style={{
    position: "absolute",
    left: 820,
    top: 760,

    zIndex: 5,

    fontSize: 95,
    lineHeight: 1,

    color: "rgba(255, 182, 193, 0.42)",

    fontFamily: "Arial, sans-serif",

    textShadow:
      "0 0 10px rgba(255,182,193,0.8), 0 0 25px rgba(255,182,193,0.45)",

    transform: "rotate(10deg)",

    pointerEvents: "none",
  }}
>
  ♡
</div>


      {/* ==================================================
          LEFT VERTICAL SLIDER
      ================================================== */}

      <div
        style={{
          position: "absolute",

          top: 35,
          left: 18,

          width: 365,
          height: 1850,

          overflow: "hidden",

          zIndex: 10,
        }}
      >

        {/* =================================================
            SLIDER CONTENT
        ================================================= */}

        <div
          style={{
            position: "absolute",

            top: translateY,
            left: 0,

            width: CARD_WIDTH,

            display: "flex",

            flexDirection: "column",

            gap: GAP,
          }}
        >

          {/* FIRST SET */}

          {sliderImages.map((img, index) =>
            renderCard(img, `first-${index}`)
          )}


          {/* SECOND SET */}

          {sliderImages.map((img, index) =>
            renderCard(img, `second-${index}`)
          )}

        </div>

      </div>

    </AbsoluteFill>
  );
};


// ======================================================
// SCENE 2
// 6s → 12s
//
// 4 UNIQUE IMAGES
//
// images[7]
// images[8]
// images[9]
// images[10]
//
// 45 frames each
// 4 × 45 = 180 frames = 6 seconds
// ======================================================

const Scene2: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {

  const frame = useCurrentFrame();

  // ====================================================
  // IMAGE DURATION
  // ====================================================

  const imageDuration = 45;

  // ====================================================
  // ONLY VALID IMAGES
  // ====================================================

  const sceneImages = images
    .slice(0, 4)
    .filter((img) => img?.path);

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        backgroundColor: "#000",

        overflow: "hidden",

        alignItems: "center",
        justifyContent: "center",
      }}
    >

      {sceneImages.map((img, index) => {

        // ================================================
        // IMAGE START / END
        // ================================================

        const start =
          index * imageDuration;

        const end =
          start + imageDuration;

        // ================================================
        // FADE
        // ================================================

        const opacity = interpolate(
          frame,

          [
            start,
            start + 5,
            end - 5,
            end,
          ],

          [
            0,
            1,
            1,
            0,
          ],

          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // ================================================
        // ZOOM
        //
        // 1.00 → 1.10 → 1.00
        // ================================================

        const scale = interpolate(
          frame,

          [
            start,
            start + imageDuration * 0.5,
            end,
          ],

          [
            1,
            1.10,
            1,
          ],

          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // ================================================
        // IMAGE
        // ================================================

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity,

              alignItems: "center",
              justifyContent: "center",

              overflow: "hidden",

              zIndex: index,
            }}
          >

            {/* ============================================
                IMAGE CONTAINER
            ============================================ */}

            <div
              style={{
                width: 1000,
                height: 1550,

                position: "relative",

                overflow: "hidden",

                borderRadius: 12,

                backgroundColor: "#111",

                boxShadow:
                  "0 0 35px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.75)",
              }}
            >

              {/* ==========================================
                  IMAGE
              ========================================== */}

              <Img
                src={img.path}
                style={{
                  position: "absolute",

                  top: 0,
                  left: 0,

                  width: "100%",
                  height: "100%",

                  objectFit: "cover",
                  objectPosition: "center",

                  transform:
                    `scale(${scale})`,

                  transformOrigin:
                    "center center",

                  display: "block",

                  // Important:
                  // Image itself stays inside
                  // container because parent has
                  // overflow:hidden
                }}
              />

            </div>

          </AbsoluteFill>
        );
      })}

    </AbsoluteFill>
  );
};


// ======================================================
// TEMPLATE 28
//
// TOTAL:
// Scene 1 = 180 frames = 6 sec
// Scene 2 = 180 frames = 6 sec
//
// TOTAL = 360 frames = 12 sec
// ======================================================

export const Template3 = ({
  images = [],
  music=undefined,
}: Template3Props) => {
const musicSrc = music ;
 console.log("🎵 Template3 musicSrc:", musicSrc);
  return (
    <>
    {/* 🎵 Direct Audio Tag – MusicPlayer को Bypass */}
      {musicSrc && (
        <MusicPlayer
          src={musicSrc} 
          volume={0.8} 
          loop={true} 
        />
      )}
      {/* ==================================================
          SCENE 1
          0s → 6s
          180 FRAMES
      ================================================== */}

      <Sequence
        from={0}
        durationInFrames={180}
      >
        <Scene1
          images={images}
        />
      </Sequence>


      {/* ==================================================
          SCENE 2
          6s → 12s
          180 FRAMES
      ================================================== */}

      <Sequence
        from={180}
        durationInFrames={180}
      >
        <Scene2
          images={images.slice(7, 11)}
        />
      </Sequence>

    </>
  );
};

export default Template3;