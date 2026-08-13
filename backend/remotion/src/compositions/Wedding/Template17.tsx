import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { MusicPlayer } from "../../components";
// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Template17Props {
  images?: ImageItem[];
 music: {
  path: string;
  volume?: number;
}
}

// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 12;

// 18.5 sec @ 30 FPS
export const DURATION_IN_FRAMES = 555;

// ======================================================
// COMPONENT
// ======================================================

export const Template17 = ({
  images = [],
  music,

}: Template17Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ======================================================
  // IMAGES
  // ======================================================

  const [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
  ] = images;

  // ======================================================
  // IMAGE COUNT CHECK
  // ======================================================

  if (images.length < IMAGE_COUNT) {
    console.warn(
      `Wedding12Composition: Expected ${IMAGE_COUNT} images, but received ${images.length}.`
    );
  }

  // ======================================================
  // SCENE DURATIONS
  // ======================================================
  //
  // Scene 1 = 2.5 sec
  // Scene 2 = 2.5 sec
  // Scene 3 = 3 sec
  // Scene 4 = 6 sec
  // Scene 5 = 4.5 sec
  //
  // TOTAL = 18.5 sec = 555 frames @ 30 FPS
  //
  // ======================================================

  const scene1Duration = 75;   // 2.5 sec
  const scene2Duration = 75;   // 2.5 sec
  const scene3Duration = 90;   // 3 sec
  const scene4Duration = 180;  // 6 sec
  const scene5Duration = 135;  // 4.5 sec

  // ======================================================
  // SCENE STARTS
  // ======================================================

  const scene1Start = 0;

  const scene2Start =
    scene1Start + scene1Duration;

  const scene3Start =
    scene2Start + scene2Duration;

  const scene4Start =
    scene3Start + scene3Duration;

  const scene5Start =
    scene4Start + scene4Duration;

  // ======================================================
  // HELPERS
  // ======================================================

  const clamp = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  };

  // ======================================================
  // COMMON FULL SCREEN IMAGE
  // ======================================================

  const ImageView = ({
    src,
    zoom = 1,
  }: {
    src?: string;
    zoom?: number;
  }) => {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#050505",
          overflow: "hidden",
        }}
      >
        {/* Blurred Background */}

        {src && (
          <Img
            src={src}
            style={{
              position: "absolute",
              inset: -80,
              width: "calc(100% + 160px)",
              height: "calc(100% + 160px)",
              objectFit: "cover",
              filter: "blur(35px) brightness(.35)",
              transform: "scale(1.15)",
            }}
          />
        )}

        {/* Main Image */}

        {src && (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: `scale(${zoom})`,
              }}
            />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    );
  };

  // ======================================================
  // WHITE CARD
  // ======================================================

  const WhiteCard = ({
    src,
    rotate = 0,
  }: {
    src?: string;
    rotate?: number;
  }) => {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 14,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          borderRadius: 22,
          transform: `rotate(${rotate}deg)`,
          boxShadow:
            "0 25px 70px rgba(0,0,0,.45)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 14,
            overflow: "hidden",
            backgroundColor: "#111",
          }}
        >
          {src && (
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </div>
      </div>
    );
  };

  // ======================================================
  // SCENE 1
  // CINEMATIC CURTAIN HERO
  // IMAGE 1
  // ======================================================

  const scene1Frame = Math.max(
    0,
    Math.min(frame - scene1Start, scene1Duration)
  );

  const curtainProgress = interpolate(
    scene1Frame,
    [0, 38],
    [0, 1],
    clamp
  );

  const leftCurtainX = interpolate(
    curtainProgress,
    [0, 1],
    [0, -560],
    clamp
  );

  const rightCurtainX = interpolate(
    curtainProgress,
    [0, 1],
    [0, 560],
    clamp
  );

  const heroScale = interpolate(
    scene1Frame,
    [0, scene1Duration],
    [1, 1.07],
    clamp
  );

  const heroTextOpacity = interpolate(
    scene1Frame,
    [18, 35, 58, 75],
    [0, 1, 1, 0],
    clamp
  );

  // ======================================================
  // SCENE 2
  // THREE CARD REVEAL
  // IMAGES 2,3,4
  // ======================================================

  const scene2Frame = Math.max(
    0,
    Math.min(frame - scene2Start, scene2Duration)
  );

  const card1X = interpolate(
    scene2Frame,
    [0, 20],
    [-600, 70],
    clamp
  );

  const card2X = interpolate(
    scene2Frame,
    [12, 32],
    [1100, 70],
    clamp
  );

  const card3X = interpolate(
    scene2Frame,
    [25, 45],
    [-600, 70],
    clamp
  );

  const card1Rotate = interpolate(
    scene2Frame,
    [0, 20],
    [-14, -6],
    clamp
  );

  const card2Rotate = interpolate(
    scene2Frame,
    [12, 32],
    [12, 4],
    clamp
  );

  const card3Rotate = interpolate(
    scene2Frame,
    [25, 45],
    [-10, -3],
    clamp
  );

  // ======================================================
  // SCENE 3
  // SINGLE IMAGE SEQUENCE
  // IMAGES 5,6,7
  //
  // NO COLLAGE
  // ======================================================

  const scene3Frame = Math.max(
    0,
    Math.min(frame - scene3Start, scene3Duration)
  );

  const singleImageDuration = 30; // 1 sec each

  const scene3ImageIndex = Math.min(
    2,
    Math.floor(scene3Frame / singleImageDuration)
  );

  const scene3Images = [
    img5,
    img6,
    img7,
  ];

  const scene3Image = scene3Images[scene3ImageIndex];

  const scene3LocalFrame =
    scene3Frame % singleImageDuration;

  const scene3Scale = interpolate(
    scene3LocalFrame,
    [0, singleImageDuration],
    [1.02, 1.08],
    clamp
  );

  const scene3Opacity = interpolate(
    scene3LocalFrame,
    [0, 8, 22, 30],
    [0, 1, 1, 0],
    clamp
  );

  // ======================================================
  // SCENE 4
  // MEMORY CARDS
  // IMAGES 8,9,10,11
  //
  // OLD MOSAIC REMOVED
  // ======================================================

  const scene4Frame = Math.max(
    0,
    Math.min(frame - scene4Start, scene4Duration)
  );

  const memoryDuration = 45; // 1.5 sec each

  const memoryIndex = Math.min(
    3,
    Math.floor(scene4Frame / memoryDuration)
  );

  const memoryImages = [
    img8,
    img9,
    img10,
    img11,
  ];

  const currentMemory =
    memoryImages[memoryIndex];

  const memoryLocalFrame =
    scene4Frame % memoryDuration;

  const memoryOpacity = interpolate(
    memoryLocalFrame,
    [0, 8, 34, 45],
    [0, 1, 1, 0],
    clamp
  );

  const memoryScale = interpolate(
    memoryLocalFrame,
    [0, memoryDuration],
    [0.88, 1.02],
    clamp
  );

  const memoryY = interpolate(
    memoryLocalFrame,
    [0, memoryDuration],
    [50, -20],
    clamp
  );

  const memoryRotate =
    memoryIndex % 2 === 0 ? -4 : 4;

  // ======================================================
  // SCENE 5
  // HERO ENDING
  // IMAGE 12
  // ======================================================

  const scene5Frame = Math.max(
    0,
    Math.min(frame - scene5Start, scene5Duration)
  );

  const endingScale = interpolate(
    scene5Frame,
    [0, scene5Duration],
    [1, 1.09],
    clamp
  );

  const endingOpacity = interpolate(
    scene5Frame,
    [0, 20],
    [0, 1],
    clamp
  );

  const endingTextY = interpolate(
    scene5Frame,
    [0, 30],
    [70, 0],
    clamp
  );

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        overflow: "hidden",
      }}
    >
            {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}


      {/* ==================================================
          SCENE 1
      ================================================== */}

      <Sequence
        from={scene1Start}
        durationInFrames={scene1Duration}
      >
        <AbsoluteFill>

          <ImageView
            src={img1?.path}
            zoom={heroScale}
          />

          {/* Left Curtain */}

          <div
            style={{
              position: "absolute",
              top: 0,
              left: leftCurtainX,
              width: "50%",
              height: "100%",
              background:
                "linear-gradient(to right,#020202,#191919)",
              zIndex: 10,
            }}
          />

          {/* Right Curtain */}

          <div
            style={{
              position: "absolute",
              top: 0,
              right: rightCurtainX,
              width: 560,
              height: "100%",
              background:
                "linear-gradient(to left,#020202,#191919)",
              zIndex: 10,
            }}
          />

          {/* Gradient */}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top,rgba(0,0,0,.7),transparent 60%)",
              zIndex: 15,
            }}
          />

          {/* Title */}

          <div
            style={{
              position: "absolute",
              bottom: 190,
              width: "100%",
              textAlign: "center",
              color: "#fff",
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: 9,
              opacity: heroTextOpacity,
              zIndex: 20,
              textShadow:
                "0 8px 30px rgba(0,0,0,.65)",
            }}
          >
            WEDDING FILM
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 130,
              width: "100%",
              textAlign: "center",
              color: "#ddd",
              fontSize: 23,
              letterSpacing: 5,
              opacity: heroTextOpacity,
              zIndex: 20,
            }}
          >
            EVERY PICTURE TELLS A STORY
          </div>

        </AbsoluteFill>
      </Sequence>

      {/* ==================================================
          SCENE 2
          IMAGES 2,3,4
      ================================================== */}

      <Sequence
        from={scene2Start}
        durationInFrames={scene2Duration}
      >
        <AbsoluteFill>

          <ImageView
            src={img2?.path}
            zoom={1.03}
          />

          {/* Image 2 */}

          <div
            style={{
              position: "absolute",
              top: 80,
              left: card1X,
              width: 420,
              height: 500,
              transform:
                `rotate(${card1Rotate}deg)`,
              zIndex: 3,
            }}
          >
            <WhiteCard
              src={img2?.path}
            />
          </div>

          {/* Image 3 */}

          <div
            style={{
              position: "absolute",
              top: 390,
              left: card2X,
              width: 420,
              height: 500,
              transform:
                `rotate(${card2Rotate}deg)`,
              zIndex: 4,
            }}
          >
            <WhiteCard
              src={img3?.path}
            />
          </div>

          {/* Image 4 */}

          <div
            style={{
              position: "absolute",
              top: 700,
              left: card3X,
              width: 420,
              height: 500,
              transform:
                `rotate(${card3Rotate}deg)`,
              zIndex: 5,
            }}
          >
            <WhiteCard
              src={img4?.path}
            />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.4))",
              zIndex: 1,
            }}
          />

        </AbsoluteFill>
      </Sequence>

      {/* ==================================================
          SCENE 3
          SINGLE IMAGES
          5 → 6 → 7
          NO COLLAGE
      ================================================== */}

      <Sequence
        from={scene3Start}
        durationInFrames={scene3Duration}
      >
        <AbsoluteFill>

          <ImageView
            src={scene3Image?.path}
            zoom={scene3Scale}
          />

          <AbsoluteFill
            style={{
              opacity: scene3Opacity,
              background:
                "linear-gradient(to top,rgba(0,0,0,.55),transparent 60%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 130,
              width: "100%",
              textAlign: "center",
              color: "#fff",
              fontSize: 26,
              letterSpacing: 5,
              opacity: scene3Opacity,
              textShadow:
                "0 4px 15px rgba(0,0,0,.8)",
            }}
          >
            BEAUTIFUL MOMENTS
          </div>

        </AbsoluteFill>
      </Sequence>

      {/* ==================================================
          SCENE 4
          MEMORY CARDS
          8 → 9 → 10 → 11
      ================================================== */}

      <Sequence
        from={scene4Start}
        durationInFrames={scene4Duration}
      >
        <AbsoluteFill>

          {/* Background */}

          <ImageView
            src={currentMemory?.path}
            zoom={1}
          />

          {/* Dark overlay */}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "rgba(0,0,0,.25)",
            }}
          />

          {/* Memory Card */}

          <div
            style={{
              position: "absolute",
              left: 135,
              top: 250,
              width: 810,
              height: 1050,
              opacity: memoryOpacity,
              transform:
                `translateY(${memoryY}px) scale(${memoryScale})`,
            }}
          >
            <WhiteCard
              src={currentMemory?.path}
              rotate={memoryRotate}
            />
          </div>

          {/* Number */}

          <div
            style={{
              position: "absolute",
              top: 115,
              right: 80,
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 3,
              opacity: memoryOpacity,
            }}
          >
            {String(memoryIndex + 1).padStart(2, "0")} / 04
          </div>

        </AbsoluteFill>
      </Sequence>

      {/* ==================================================
          SCENE 5
          FINAL HERO
          IMAGE 12
      ================================================== */}

      <Sequence
        from={scene5Start}
        durationInFrames={scene5Duration}
      >
        <AbsoluteFill>

          {/* Blurred background */}

          <Img
            src={img12?.path ?? ""}
            style={{
              position: "absolute",
              inset: -80,
              width: "calc(100% + 160px)",
              height: "calc(100% + 160px)",
              objectFit: "cover",
              filter:
                "blur(35px) brightness(.3)",
              transform: "scale(1.15)",
            }}
          />

          {/* Main Image */}

          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={img12?.path ?? ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform:
                  `scale(${endingScale})`,
              }}
            />
          </AbsoluteFill>

          {/* Vignette */}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top,rgba(0,0,0,.75),rgba(0,0,0,.1) 65%)",
            }}
          />

          {/* Ending title */}

          <div
            style={{
              position: "absolute",
              bottom: 230,
              width: "100%",
              textAlign: "center",
              color: "#fff",
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: 7,
              opacity: endingOpacity,
              transform:
                `translateY(${endingTextY}px)`,
              textShadow:
                "0 10px 35px rgba(0,0,0,.7)",
            }}
          >
            FOREVER BEGINS
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 160,
              width: "100%",
              textAlign: "center",
              color: "#ddd",
              fontSize: 23,
              letterSpacing: 4,
              opacity: endingOpacity,
              transform:
                `translateY(${endingTextY}px)`,
            }}
          >
            A BEAUTIFUL JOURNEY STARTS HERE
          </div>

        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};

export default Template17;