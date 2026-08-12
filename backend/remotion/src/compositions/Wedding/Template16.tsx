import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { MusicPlayer } from "../../components";
// ======================================================
// TEMPLATE SETTINGS
// ======================================================

export const IMAGE_COUNT = 13;
export const FPS = 30;
export const DURATION_IN_FRAMES = 690; // 23 seconds

// ======================================================
// INTERFACES
// ======================================================

interface ImageItem {
  path: string;
}



interface WeddingTemplate14Props {
  images?: ImageItem[];
 music?: {
    path: string;
    volume?: number;
  };
 
}

// ======================================================
// SCENE 1
// 0 - 7 sec
// 4 Images
// ======================================================

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const img1Opacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const img1Y = interpolate(
    frame,
    [0, 20],
    [-60, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const img2Opacity = interpolate(
    frame,
    [50, 70],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const img2X = interpolate(
    frame,
    [50, 70],
    [-80, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const img3Opacity = interpolate(
    frame,
    [100, 120],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const img3X = interpolate(
    frame,
    [100, 120],
    [80, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const img4Opacity = interpolate(
    frame,
    [150, 170],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const img4Y = interpolate(
    frame,
    [150, 170],
    [80, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const darkEffect = interpolate(
    frame,
    [180, 190, 205],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fff",
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          filter: `
            brightness(${1 - darkEffect * 0.75})
            grayscale(${darkEffect})
          `,
        }}
      >
        {/* IMAGE 1 */}

        <div
          style={{
            flex: 1.3,
            minHeight: 0,
            overflow: "hidden",
            borderRadius: 12,
            opacity: img1Opacity,
            transform: `translateY(${img1Y}px)`,
          }}
        >
          <Img
            src={images[0]?.path}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>

        {/* IMAGE 2 + IMAGE 3 */}

        <div
          style={{
            flex: 0.8,
            minHeight: 0,
            display: "flex",
            gap: 18,
          }}
        >
          {/* IMAGE 2 */}

          <div
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
              borderRadius: 12,
              opacity: img2Opacity,
              transform: `translateX(${img2X}px)`,
            }}
          >
            <Img
              src={images[1]?.path}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>

          {/* IMAGE 3 */}

          <div
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
              borderRadius: 12,
              opacity: img3Opacity,
              transform: `translateX(${img3X}px)`,
            }}
          >
            <Img
              src={images[2]?.path}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* IMAGE 4 */}

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            borderRadius: 12,
            opacity: img4Opacity,
            transform: `translateY(${img4Y}px)`,
          }}
        >
          <Img
            src={images[3]?.path}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2
// 7 - 16 sec
// 4 Images
// ======================================================

// ======================================================
// SCENE 2
// 7 - 16 sec
// 4 Images
// CENTER ONLY
// ======================================================

const Scene2: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const IMAGE_DURATION = 68;

  const leftMove = interpolate(
    frame,
    [0, 30, 60, 90, 120, 150, 180, 210],
    [0, -120, 0, -120, 0, -120, 0, -120],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const rightMove = interpolate(
    frame,
    [0, 30, 60, 90, 120, 150, 180, 210],
    [0, 120, 0, 120, 0, 120, 0, 120],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          LEFT FILM STRIP
      ================================================== */}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 75,
          height: "200%",
          background:
            "linear-gradient(180deg,#e6c85c,#9bb56a,#e6c85c)",
          transform: `translateY(${leftMove}px)`,
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "repeating-linear-gradient(180deg, transparent 0px, transparent 25px, rgba(0,0,0,.7) 25px, rgba(0,0,0,.7) 42px)",
          }}
        />
      </div>

      {/* ==================================================
          RIGHT FILM STRIP
      ================================================== */}

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 75,
          height: "200%",
          background:
            "linear-gradient(180deg,#4bb6c7,#78d6d1,#4bb6c7)",
          transform: `translateY(${rightMove}px)`,
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "repeating-linear-gradient(180deg, transparent 0px, transparent 25px, rgba(0,0,0,.7) 25px, rgba(0,0,0,.7) 42px)",
          }}
        />
      </div>

      {/* ==================================================
          CENTER IMAGE
      ================================================== */}

      {images.slice(0, 4).map((img, index) => {
        const start = index * IMAGE_DURATION;
        const end = start + IMAGE_DURATION;

        const opacity = interpolate(
          frame,
          [
            start,
            start + 8,
            end - 8,
            end,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // Center se slight zoom
        const scale = interpolate(
          frame,
          [start, end],
          [1.04, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <AbsoluteFill
            key={index}
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 900,
                height: 1200,

                overflow: "hidden",

                borderRadius: 14,

                backgroundColor: "#111",

                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.7)",

                transform: `scale(${scale})`,
              }}
            >
              <Img
                src={img.path}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
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
// SCENE 3
// 16 - 23 sec
// 5 Images
// ======================================================

const Scene3: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const imageDuration = 68;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {images.slice(0, 5).map((img, index) => {
        const start = index * imageDuration;

        const opacity = interpolate(
          frame,
          [
            start,
            start + 8,
            start + imageDuration - 8,
            start + imageDuration,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const scale = interpolate(
          frame,
          [start, start + imageDuration],
          [1.12, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "85%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Img
                src={img.path}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${scale})`,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 100,
                  filter:
                    "drop-shadow(0 0 10px rgba(255,0,100,0.7))",
                }}
              >
                💞
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ======================================================
// TEMPLATE 14
// ======================================================

export const WeddingTemplate14: React.FC<WeddingTemplate14Props> = ({
  images = [],
  music,
}) => {
  return (
    <AbsoluteFill>

      {/* ==============================
          MUSIC
      ============================== */}

      {music?.path && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

      {/* ==============================
          SCENE 1
          0 - 7 sec
      ============================== */}

      <Sequence
        from={0}
        durationInFrames={210}
      >
        <Scene1
          images={images.slice(0, 4)}
        />
      </Sequence>

      {/* ==============================
          SCENE 2
          7 - 16 sec
      ============================== */}

      <Sequence
        from={210}
        durationInFrames={270}
      >
        <Scene2
          images={images.slice(4, 8)}
        />
      </Sequence>

      {/* ==============================
          SCENE 3
          16 - 23 sec
      ============================== */}

      <Sequence
        from={480}
        durationInFrames={210}
      >
        <Scene3
          images={images.slice(8, 13)}
        />
      </Sequence>

    </AbsoluteFill>
  );
};

// ======================================================
// AUTO REGISTRATION
// ======================================================

export const DEFAULT_PROPS: WeddingTemplate14Props = {
  images: [],
  music: undefined,
};

export const Template16 = WeddingTemplate14;

export default Template16;