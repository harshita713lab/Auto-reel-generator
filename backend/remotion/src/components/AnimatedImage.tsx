import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";

interface AnimatedImageProps {
  src: string;
  animation?: string;
  durationInFrames?: number;
  style?: React.CSSProperties;

  startFrame?: number;

}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  animation = "kenBurns",
  durationInFrames = 18,
  style,
    startFrame = 0,
}) => {
const globalFrame = useCurrentFrame();

const frame = Math.max(0, globalFrame - startFrame);

  const end = durationInFrames;

  let scale = 1;
  let x = 0;
  let y = 0;
  let rotate = 0;

  switch (animation) {
    case "kenBurns":
      scale = interpolate(frame, [0, end], [1, 1.08], {
        easing: Easing.ease,
        extrapolateRight: "clamp",
      });
      break;

    case "zoomIn":
      scale = interpolate(frame, [0, end], [1, 1.12], {
        easing: Easing.ease,
        extrapolateRight: "clamp",
      });
      break;

    case "slideLeft":
      x = interpolate(frame, [0, end], [100, 0], {
        easing: Easing.ease,
        extrapolateRight: "clamp",
      });
      break;

    case "slideRight":
      x = interpolate(frame, [0, end], [-100, 0], {
        easing: Easing.ease,
        extrapolateRight: "clamp",
      });
      break;

    case "zoomOut":
      scale = interpolate(frame, [0, end], [1.08, 1], {
        easing: Easing.ease,
        extrapolateRight: "clamp",
      });
      break;

    case "panLeft":
      x = interpolate(frame, [0, end], [0, -20], {
        extrapolateRight: "clamp",
      });
      break;

    case "panRight":
      x = interpolate(frame, [0, end], [0, 20], {
        extrapolateRight: "clamp",
      });
      break;

    case "panUp":
      y = interpolate(frame, [0, end], [0, -15], {
        extrapolateRight: "clamp",
      });
      break;

    case "panDown":
      y = interpolate(frame, [0, end], [0, 15], {
        extrapolateRight: "clamp",
      });
      break;

    case "rotate":
      rotate = interpolate(frame, [0, end], [-1, 1], {
        extrapolateRight: "clamp",
      });
      break;

    default:
      scale = interpolate(frame, [0, end], [1, 1.08], {
        easing: Easing.ease,
        extrapolateRight: "clamp",
      });
  }

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",

          transform: `
            translate(${x}px, ${y}px)
            scale(${scale})
            rotate(${rotate}deg)
          `,

          willChange: "transform",

          ...style,
        }}
        onError={() => console.log("Image Error", src)}
      />
    </AbsoluteFill>
  );
};

export default AnimatedImage;