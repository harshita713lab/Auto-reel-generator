import React from "react";
import {
  AbsoluteFill,
  Img,
  Audio,
  interpolate,
  useCurrentFrame,
} from "remotion";

// ======================================================
// TYPES
// ======================================================

interface ImageItem {
  path: string;
}

interface Music {
  path: string;
  volume?: number;
}

interface Template21Props {
  images?: ImageItem[];
  music?: Music;
}

// ======================================================
// SETTINGS
// ======================================================

export const IMAGE_COUNT = 3;
export const FPS = 30;
export const DURATION_IN_FRAMES = 240; // 8 seconds

// ======================================================
// MAIN COMPOSITION
// ======================================================

export const Template21: React.FC<Template21Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // IMAGES
  // ====================================================

  const image1 = images[0]?.path;
  const image2 = images[1]?.path;
  const image3 = images[2]?.path;

  // ====================================================
  // SUBTLE ZOOM
  // ====================================================

  const zoom1 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1, 1.025],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const zoom2 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1.025, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const zoom3 = interpolate(
    frame,
    [0, DURATION_IN_FRAMES],
    [1, 1.02],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // TEXT OPACITY
  // ====================================================

  const textOpacity = interpolate(
    frame,
    [0, 10, DURATION_IN_FRAMES - 10, DURATION_IN_FRAMES],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // PANEL STYLE
  // ====================================================

  const panelStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "33.333333%",
    overflow: "hidden",
  };

  // ====================================================
  // IMAGE STYLE
  // ====================================================

  const imageStyle = (
    zoom: number
  ): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${zoom})`,
  });

  // ====================================================
  // TEXT STYLE
  // ====================================================

  const textStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
    textAlign: "center",
    textShadow: "0px 2px 8px rgba(0,0,0,0.55)",
    opacity: textOpacity,
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >

      {/* ==================================================
          PANEL 1
      ================================================== */}

      <div
        style={{
          ...panelStyle,
          top: "0%",
        }}
      >
        {image1 && (
          <Img
            src={image1}
            style={imageStyle(zoom1)}
          />
        )}

        {/* Warm overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(80, 45, 30, 0.10)",
          }}
        />

        {/* Text */}
        <div style={textStyle}>
          <div
            style={{
              fontSize: 30,
            }}
          >
            suna hai suna hai
          </div>
        </div>
      </div>


      {/* ==================================================
          PANEL 2
      ================================================== */}

      <div
        style={{
          ...panelStyle,
          top: "33.333333%",
        }}
      >
        {image2 && (
          <Img
            src={image2}
            style={imageStyle(zoom2)}
          />
        )}

        {/* Warm overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(80, 45, 30, 0.08)",
          }}
        />

        {/* Text */}
        <div
          style={{
            ...textStyle,
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 32,
            }}
          >
            "yeh rasme"
          </div>

          <div
            style={{
              color: "#ff3b3b",
              fontSize: 26,
              marginTop: 2,
              textShadow:
                "0px 2px 6px rgba(0,0,0,0.45)",
            }}
          >
            ♥
          </div>
        </div>
      </div>


      {/* ==================================================
          PANEL 3
      ================================================== */}

      <div
        style={{
          ...panelStyle,
          top: "66.666666%",
        }}
      >
        {image3 && (
          <Img
            src={image3}
            style={imageStyle(zoom3)}
          />
        )}

        {/* Warm overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(80, 45, 30, 0.10)",
          }}
        />

        {/* Text */}
        <div style={textStyle}>
          <div
            style={{
              fontSize: 31,
            }}
          >
            wafa hai..
          </div>
        </div>
      </div>


      {/* ==================================================
          VINTAGE COLOR
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "linear-gradient(" +
            "rgba(255,220,180,0.04), " +
            "rgba(120,70,40,0.06)" +
            ")",
          mixBlendMode: "soft-light",
        }}
      />


      {/* ==================================================
          VIGNETTE
      ================================================== */}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(" +
            "ellipse at center, " +
            "transparent 55%, " +
            "rgba(0,0,0,0.18) 100%" +
            ")",
        }}
      />


      {/* ==================================================
          MUSIC
      ================================================== */}

      {music?.path && (
        <Audio
          src={music.path}
          volume={music.volume ?? 1}
        />
      )}

    </AbsoluteFill>
  );
};

export default Template21;