import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

// ======================================================
// INTERFACES
// ======================================================

interface ImageItem {
  path: string;
}

interface TemplateGridProps {
  images?: ImageItem[];
  textOverlay?: {
    image1?: string;
    image2?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
}

// ======================================================
// OVERLAY TEXT
// ======================================================

const OverlayText: React.FC<{
  text?: string;
  startFrame: number;
}> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!text) return null;

  const textSpring = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 12,
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${textSpring})`,
        color: "#FFFFFF",
        fontFamily: "Comic Sans MS, Changa One, sans-serif",
        fontSize: "48px",
        fontWeight: "bold",
        lineHeight: 1.1,
        textAlign: "center",
        textShadow:
          "3px 3px 8px rgba(0,0,0,0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
        opacity: textSpring,
        whiteSpace: "pre-line",
        width: "90%",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

// ======================================================
// MAIN SCENE
// ======================================================

const SequentialGridScene: React.FC<TemplateGridProps> = ({
  images = [],
  textOverlay = {
    image1: "you\nand",
    image2: "me",
    topRight: "belong\ntogether",
    bottomLeft: "like\ncold\nICED\ntea",
    bottomRight: "and\nwarmer\nweather",
  },
}) => {
  const frame = useCurrentFrame();

  // ======================================================
  // 5 IMAGES
  // ======================================================

  const img1 = images[0]?.path || "";
  const img2 = images[1]?.path || "";
  const img3 = images[2]?.path || "";
  const img4 = images[3]?.path || "";
  const img5 = images[4]?.path || "";

  // ======================================================
  // CARD ANIMATION
  // ======================================================

  const getCardAnim = (startFrame: number) => {
    const opacity = interpolate(
      frame,
      [startFrame, startFrame + 10],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    const scale = interpolate(
      frame,
      [startFrame, startFrame + 15],
      [0.9, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    return {
      opacity,
      transform: `scale(${scale})`,
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* ==================================================
          MAIN 2x2 GRID
          ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          width: "100%",
          height: "100%",
          gap: "4px",
          backgroundColor: "#000000",
        }}
      >

        {/* ==================================================
            BOX 1 - IMAGE 1 + IMAGE 2
            0 - 2 SEC
            ================================================== */}

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            ...getCardAnim(0),
          }}
        >
          {/* IMAGE 1 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "50%",
              overflow: "hidden",
            }}
          >
            {img1 && (
              <Img
                src={img1}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            <OverlayText
              text={textOverlay.image1}
              startFrame={0}
            />
          </div>

          {/* IMAGE 2 */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "50%",
              overflow: "hidden",
            }}
          >
            {img2 && (
              <Img
                src={img2}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            <OverlayText
              text={textOverlay.image2}
              startFrame={0}
            />
          </div>
        </div>

        {/* ==================================================
            BOX 2 - IMAGE 3
            2 - 4 SEC
            ================================================== */}

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            ...getCardAnim(60),
          }}
        >
          {img3 && (
            <Img
              src={img3}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {frame >= 60 && (
            <OverlayText
              text={textOverlay.topRight}
              startFrame={60}
            />
          )}
        </div>

        {/* ==================================================
            BOX 3 - IMAGE 4
            4 - 6 SEC
            ================================================== */}

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            ...getCardAnim(120),
          }}
        >
          {img4 && (
            <Img
              src={img4}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {frame >= 120 && (
            <OverlayText
              text={textOverlay.bottomLeft}
              startFrame={120}
            />
          )}
        </div>

        {/* ==================================================
            BOX 4 - IMAGE 5
            6 - 9 SEC
            ================================================== */}

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            ...getCardAnim(180),
          }}
        >
          {img5 && (
            <Img
              src={img5}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {frame >= 180 && (
            <OverlayText
              text={textOverlay.bottomRight}
              startFrame={180}
            />
          )}
        </div>

      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// TEMPLATE 5
// ======================================================

export const Template5: React.FC<TemplateGridProps> = ({
  images = [],
  textOverlay,
}) => {
  return (
    <SequentialGridScene
      images={images}
      textOverlay={textOverlay}
    />
  );
};