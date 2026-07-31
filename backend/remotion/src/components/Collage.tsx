import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import AnimatedImage from "./AnimatedImage";

interface Props {
  images: string[];
  layoutType: string;
  animation?: string;
}

const Collage: React.FC<Props> = ({
  images,
  animation = "kenBurns",
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Background Blur */}
      <AnimatedImage
        src={images[0]}
        animation="kenBurns"
        durationInFrames={90}
        style={{
          filter: "blur(35px) brightness(0.6)",
          transform: "scale(1.2)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        {images.slice(0, 4).map((img, index) => {
          const delay = index * 10;

          const opacity = interpolate(
            frame,
            [delay, delay + 10],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const scale = interpolate(
            frame,
            [delay, delay + 10],
            [0.8, 1],
            {
              easing: Easing.out(Easing.ease),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <div
              key={index}
              style={{
                width: 260,
                height: 140,
                background: "#fff",
                padding: 8,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(0,0,0,.25)",
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              <AnimatedImage
                src={img}
                animation={animation}
                durationInFrames={90}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default Collage;