import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MusicPlayer } from "../../components";

interface WhiteCardGrid3x3Props {
  images?: Array<{ path: string }>;
  music?: {
    path: string;
    volume?: number;
  };
}

export const WhiteCardGrid3x3: React.FC<WhiteCardGrid3x3Props> = ({
  images = [],
  music,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const imageList = images.slice(0, 9);

  const cameraScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.05]
  );
const positions = [
  // Hero
  { left: 90, top: 60, width: 900, height: 650 },

  // Row 1
  { left: 120, top: 820, width: 400, height: 220 },
  { left: 560, top: 820, width: 400, height: 220 },

  // Row 2
  { left: 120, top: 1070, width: 400, height: 220 },
  { left: 560, top: 1070, width: 400, height: 220 },

  // Row 3
  { left: 120, top: 1320, width: 400, height: 220 },
  { left: 560, top: 1320, width: 400, height: 220 },

  // Row 4
  { left: 120, top: 1570, width: 400, height: 220 },
  { left: 560, top: 1570, width: 400, height: 220 },
];
 

  return (
    <AbsoluteFill
      style={{
          background:"linear-gradient(135deg,#fafafa,#ececec)",
   overflow:"hidden"
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow:"hidden",
        }}
      >
        {positions.map((pos, index) => {
          const localFrame = Math.max(frame - index * 5, 0);

          const entrance = spring({
            frame: localFrame,
            fps,
            config: {
              damping: 15,
              stiffness: 120,
            },
          });

          const imageScale =
            index === 0
              ? interpolate(frame, [0, durationInFrames], [1, 1.08])
              : interpolate(frame, [0, durationInFrames], [1, 1.03]);

   const rotate = [0,0,0,0,0,0,0,0,0];

          const floatY =
            Math.sin((frame + index * 10) / 20) * 3;

          return (
            <div
              key={index}
              style={{
                position: "absolute",

                left: pos.left,
                top: pos.top,

                width: pos.width,
                height: pos.height,

                background: "#fff",
                borderRadius: 22,
                border: "8px solid white",

                overflow: "hidden",

                opacity: entrance,

                transform: `
                  translateY(${40 * (1 - entrance) + floatY}px)
                  rotate(${rotate[index]}deg)
                `,

                boxShadow: "0 12px 40px rgba(0,0,0,.18)",
              }}
            >
              <Img
                src={imageList[index]?.path}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",

                      objectPosition: "center",

                  transform: `scale(${imageScale + 0.08})`,
                }}
              />
            </div>
          );
        })}
      </div>
<div
  style={{
    position: "absolute",
    top: 760, // Hero image ke neeche
    left: 0,
    width: "100%",
    textAlign: "center",
    fontSize: 42,
    fontWeight: 600,
    color: "#444",
    fontFamily: "Playfair Display, serif",
    letterSpacing: "2px",
    zIndex: 100,
  }}
>
  Captured with Love
</div>
      {music && (
        <MusicPlayer
          src={music.path}
          volume={music.volume ?? 1}
          duration={durationInFrames / fps}
          fadeInDuration={0.5}
          fadeOutDuration={0.8}
          showVisualizer={false}
        />
      )}
    </AbsoluteFill>
  );
};