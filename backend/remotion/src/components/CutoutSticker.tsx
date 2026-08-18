import React from "react";
import { Img, useCurrentFrame, interpolate, Easing } from "remotion";

interface CutoutStickerProps {
  src: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const CutoutSticker: React.FC<CutoutStickerProps> = ({
  src,
  width = "100%",
  height = "100%",
  style = {},
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 20], [0.9, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.2)),
  });

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // Image ko proper proportion mein rakhne ke liye
          // Koi white background ya border nahi, sirf cutout ke kinaro par soft 3D shadow
          filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.8))",
        }}
      />
    </div>
  );
};