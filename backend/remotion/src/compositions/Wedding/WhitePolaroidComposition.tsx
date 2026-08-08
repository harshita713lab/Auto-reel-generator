import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { getBeatScale } from "../../utils/beatUtils";

interface ImageItem {
  path: string;
}

interface WhiteCardPolaroidStackProps {
  images?: ImageItem[];
  music?: {
    path: string;
    volume?: number;
  };
  title?: string;
  backgroundColor?: string;
  cardColor?: string;
  showCounter?: boolean;
  beatTimestamps?: number[];
}

export const WhiteCardPolaroidStack: React.FC<
  WhiteCardPolaroidStackProps
> = ({
  images = [],
  backgroundColor = "linear-gradient(135deg, #111122, #1a1a3a)",
  cardColor = "#ffffff",
  showCounter = true,
  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const beatScale = getBeatScale(frame, fps, beatTimestamps);

  const imageList = images.slice(0, 6);
  const totalFrames = 450; // 15 Seconds

  // Shimmering Golden Light Leak effect across the 15-second duration
  const lightLeakX = interpolate(frame, [0, totalFrames], [-200, width + 200]);
  const lightLeakOpacity = interpolate(
    frame,
    [0, 50, 200, 350, 450],
    [0.2, 0.45, 0.25, 0.5, 0.2]
  );

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Ambient Background Glowing Aura */}
      <div
        style={{
          position: "absolute",
          width: 950,
          height: 950,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.18), transparent 70%)",
          filter: "blur(90px)",
          transform: `scale(${beatScale})`,
          zIndex: 0,
        }}
      />

      {/* Cinematic Golden Light Leak Effect */}
      <div
        style={{
          position: "absolute",
          top: -150,
          left: lightLeakX,
          width: 400,
          height: height + 300,
          background: "linear-gradient(45deg, transparent, rgba(255,215,0,0.35), transparent)",
          filter: "blur(50px)",
          transform: "rotate(25deg)",
          opacity: lightLeakOpacity,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {/* Vignette Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
          zIndex: 40,
        }}
      />

      {/* Original 3D Polaroid Cards Stack (Spanning 15 Seconds) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${beatScale})`,
          zIndex: 10,
        }}
      >
        {imageList.map((img, index) => {
          // Staggered card entry across 15 seconds (every 40 frames ~1.33s)
          const delay = index * 45;

          const enter = spring({
            fps,
            frame: frame - delay,
            config: {
              damping: 18,
              stiffness: 45,
              mass: 1.1,
            },
          });

          const stackRotate = [-14, -8, -3, 3, 8, 14][index] ?? 0;
          const stackX = [-140, -85, -30, 30, 85, 140][index] ?? 0;
          const stackY = [60, 35, 15, 10, 35, 60][index] ?? 0;

          const translateX = interpolate(enter, [0, 1], [-width, stackX]);
          const translateY = interpolate(enter, [0, 1], [height, stackY]);
          const rotate = interpolate(enter, [0, 1], [-25, stackRotate]);
          let scale = interpolate(enter, [0, 1], [0.75, 1]);
          const opacity = interpolate(enter, [0, 1], [0, 1]);

          // Last card grand zoom highlight near the end
          if (index === imageList.length - 1) {
            const zoom = spring({
              fps,
              frame: frame - (delay + 60),
              config: {
                damping: 18,
                stiffness: 55,
              },
            });

            scale = interpolate(zoom, [0, 1], [1, 1.28]);
          }

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                width: 620,
                height: 780,
                background: cardColor,
                borderRadius: 14,
                padding: 18,
                boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
                transform: `
                  translate(${translateX}px, ${translateY}px)
                  rotate(${rotate}deg)
                  scale(${scale})
                `,
                opacity,
                zIndex: index + 1,
              }}
            >
              <Img
                src={img.path}
                style={{
                  width: "100%",
                  height: 640,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />

              {/* Bottom Clean White Frame */}
              <div
                style={{
                  height: 104,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "0 14px",
                }}
              >
                {showCounter && (
                  <div
                    style={{
                      fontSize: 20,
                      color: "#777",
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")} / {String(imageList.length).padStart(2, "0")}
                  </div>
                )}
              </div>

              {/* Paper Texture Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  background:
                    "radial-gradient(circle at top left, rgba(255,255,255,.35), transparent 60%)",
                  pointerEvents: "none",
                }}
              />

              {/* Tape Accent */}
              <div
                style={{
                  position: "absolute",
                  width: 120,
                  height: 28,
                  background: "rgba(255,245,180,.65)",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%) rotate(-3deg)",
                  borderRadius: 4,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default WhiteCardPolaroidStack;