import React from "react";

import { 
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  interpolate,
 staticFile } from "remotion";
import { MusicPlayer } from "../../components";
// ======================================================
// INTERFACE
// ======================================================

interface ImageItem {
  path: string;
}

interface Template2Props {
  images?: ImageItem[];
  music?:string;
  
}

// ======================================================
// AUTO-REGISTRATION EXPORTS
// ======================================================

export const IMAGE_COUNT = 13;

export const DURATION_IN_FRAMES = 480;

export const DEFAULT_PROPS = {
  images: [],
};

// ======================================================
// SCENE DURATIONS
// ======================================================

const HERO_DURATION = 60;
const EDITORIAL_DURATION = 60;
const STRIP_DURATION = 60;
const HORIZONTAL_DURATION = 60;
const SPLIT_DURATION = 60;
const FAST_DURATION = 90;
const ENDING_DURATION = 90;

// ======================================================
// SCENE 1 - HERO
// ======================================================

const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const heroOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const heroScale = interpolate(
    frame,
    [0, HERO_DURATION],
    [1.08, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const heroTranslateY = interpolate(
    frame,
    [0, HERO_DURATION],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const heroRotate = interpolate(
    frame,
    [0, HERO_DURATION],
    [-2, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {images[0]?.path && (
        <Img
          src={images[0].path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: heroOpacity,
            transform: `
              translateY(${heroTranslateY}px)
              rotate(${heroRotate}deg)
              scale(${heroScale})
            `,
          }}
        />
      )}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 2 - EDITORIAL
// ======================================================

const Scene2: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const editorialScale = interpolate(
    frame,
    [0, EDITORIAL_DURATION],
    [1.08, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const editorialX = interpolate(
    frame,
    [0, 25],
    [120, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const panelOpacity = interpolate(
    frame,
    [10, 30],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const lineWidth = interpolate(
    frame,
    [20, 50],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#f8f8f8",
        overflow: "hidden",
      }}
    >
      {images[0]?.path && (
        <Img
          src={images[0].path}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: `
              translateX(${editorialX}px)
              scale(${editorialScale})
            `,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 320,
          height: "100%",
          padding: "70px 40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          opacity: panelOpacity,
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 5,
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          Editorial
        </div>

        <div
          style={{
            fontSize: 54,
            fontWeight: 600,
            marginTop: 18,
            lineHeight: 1.1,
          }}
        >
          Wedding
        </div>

        <div
          style={{
            marginTop: 30,
            width: lineWidth,
            height: 2,
            backgroundColor: "#111",
          }}
        />

        <div
          style={{
            marginTop: 28,
            color: "#666",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          A timeless story of love,
          elegance and unforgettable
          moments.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 3 - STRIP
// ======================================================

const Scene3: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const stripScale = interpolate(
    frame,
    [0, STRIP_DURATION],
    [1.08, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#fff",
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      {images[0]?.path &&
        Array.from({ length: 20 }).map((_, i) => {
          const reveal = interpolate(
            frame,
            [i * 2, 30 + i * 2],
            [0, 100],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <div
              key={i}
              style={{
                width: "5%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Img
                src={images[0].path}
                style={{
                  position: "absolute",
                  left: `${-i * 100}%`,
                  width: "2000%",
                  height: `${reveal}%`,
                  top: 0,
                  objectFit: "cover",
                  transform: `scale(${stripScale})`,
                  transformOrigin: "center",
                }}
              />
            </div>
          );
        })}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 4 - HORIZONTAL
// ======================================================

const Scene4: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const maskHeight = interpolate(
    frame,
    [0, 20, 40, HORIZONTAL_DURATION],
    [0, 180, 1080, 1080],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const horizontalScale = interpolate(
    frame,
    [0, HORIZONTAL_DURATION],
    [1.1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const secondImageOpacity = interpolate(
    frame,
    [35, 55],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {images[0]?.path && (
        <div
          style={{
            width: "100%",
            height: maskHeight,
            overflow: "hidden",
          }}
        >
          <Img
            src={images[0].path}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transform: `scale(${horizontalScale})`,
            }}
          />
        </div>
      )}

      {images[1]?.path && (
        <Img
          src={images[1].path}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: secondImageOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 5 - SPLIT
// ======================================================

const Scene5: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const topY = interpolate(
    frame,
    [0, 25],
    [-250, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const bottomY = interpolate(
    frame,
    [0, 25],
    [250, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const splitScale = interpolate(
    frame,
    [0, SPLIT_DURATION],
    [1.08, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {images[0]?.path && (
        <div
          style={{
            width: "100%",
            height: "50%",
            overflow: "hidden",
            transform: `translateY(${topY}px)`,
          }}
        >
          <Img
            src={images[0].path}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transform: `scale(${splitScale})`,
            }}
          />
        </div>
      )}

      {images[1]?.path && (
        <div
          style={{
            width: "100%",
            height: "50%",
            overflow: "hidden",
            transform: `translateY(${bottomY}px)`,
          }}
        >
          <Img
            src={images[1].path}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transform: `scale(${splitScale})`,
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 6 - FAST
// ======================================================

const Scene6: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const img1Frame = frame;
  const img2Frame = frame - 22;
  const img3Frame = frame - 44;
  const img4Frame = frame - 66;

  const getOpacity = (localFrame: number) =>
    interpolate(
      localFrame,
      [0, 5, 20, 22],
      [0, 1, 1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  const getScale = (localFrame: number) =>
    interpolate(
      localFrame,
      [0, 22],
      [1.08, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {images[0]?.path && (
        <Img
          src={images[0].path}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: getOpacity(img1Frame),
            transform: `
              translateX(${interpolate(
                img1Frame,
                [0, 22],
                [80, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )}px)
              scale(${getScale(img1Frame)})
            `,
          }}
        />
      )}

      {images[1]?.path && (
        <Img
          src={images[1].path}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: getOpacity(img2Frame),
            transform: `
              translateX(${interpolate(
                img2Frame,
                [0, 22],
                [-80, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )}px)
              scale(${getScale(img2Frame)})
            `,
          }}
        />
      )}

      {images[2]?.path && (
        <Img
          src={images[2].path}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: getOpacity(img3Frame),
            transform: `
              translateY(${interpolate(
                img3Frame,
                [0, 22],
                [-80, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )}px)
              scale(${getScale(img3Frame)})
            `,
          }}
        />
      )}

      {images[3]?.path && (
        <Img
          src={images[3].path}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: interpolate(
              img4Frame,
              [0, 5, 20, 22],
              [0, 1, 1, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            ),
            transform: `
              translateY(${interpolate(
                img4Frame,
                [0, 22],
                [80, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )}px)
              scale(${getScale(img4Frame)})
            `,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ======================================================
// SCENE 7 - ENDING
// ======================================================

const Scene7: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {
  const frame = useCurrentFrame();

  const endingScale = interpolate(
    frame,
    [0, ENDING_DURATION],
    [1.15, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const endingOpacity = interpolate(
    frame,
    [0, 15, 75, ENDING_DURATION],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const finalTextOpacity = interpolate(
    frame,
    [20, 40],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const secondOpacity = interpolate(
    frame,
    [55, 75],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {images[0]?.path && (
        <Img
          src={images[0].path}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: endingOpacity,
            transform: `scale(${endingScale})`,
          }}
        />
      )}

      {images[1]?.path && (
        <Img
          src={images[1].path}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: secondOpacity,
          }}
        />
      )}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 140,
          color: "#fff",
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: 6,
          opacity: finalTextOpacity,
          textShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        WEDDING STORY
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// MAIN COMPOSITION
// ======================================================

export const Template2 = ({
  images = [],
  music =undefined,
}: Template2Props) => {
   const musicSrc = music ; 
  return (
    <>
       {musicSrc && (
            <MusicPlayer
              src={musicSrc}
              volume={0.8}
              loop={true}
              showVisualizer={true}
            />
          )}
      <Sequence
        from={0}
        durationInFrames={HERO_DURATION}
      >
        <Scene1 images={images.slice(0, 1)} />
      </Sequence>

      <Sequence
        from={HERO_DURATION}
        durationInFrames={EDITORIAL_DURATION}
      >
        <Scene2 images={images.slice(1, 2)} />
      </Sequence>

      <Sequence
        from={
          HERO_DURATION +
          EDITORIAL_DURATION
        }
        durationInFrames={STRIP_DURATION}
      >
        <Scene3 images={images.slice(2, 3)} />
      </Sequence>

      <Sequence
        from={
          HERO_DURATION +
          EDITORIAL_DURATION +
          STRIP_DURATION
        }
        durationInFrames={HORIZONTAL_DURATION}
      >
        <Scene4 images={images.slice(3, 5)} />
      </Sequence>

      <Sequence
        from={
          HERO_DURATION +
          EDITORIAL_DURATION +
          STRIP_DURATION +
          HORIZONTAL_DURATION
        }
        durationInFrames={SPLIT_DURATION}
      >
        <Scene5 images={images.slice(5, 7)} />
      </Sequence>

      <Sequence
        from={
          HERO_DURATION +
          EDITORIAL_DURATION +
          STRIP_DURATION +
          HORIZONTAL_DURATION +
          SPLIT_DURATION
        }
        durationInFrames={FAST_DURATION}
      >
        <Scene6 images={images.slice(7, 11)} />
      </Sequence>

      <Sequence
        from={
          HERO_DURATION +
          EDITORIAL_DURATION +
          STRIP_DURATION +
          HORIZONTAL_DURATION +
          SPLIT_DURATION +
          FAST_DURATION
        }
        durationInFrames={ENDING_DURATION}
      >
        <Scene7 images={images.slice(11, 13)} />
      </Sequence>
    </>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default Template2;