import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
//import { MusicPlayer } from "../../components";
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
    music,

  title = "Memories",
  backgroundColor = "#f7f7f7",
  cardColor = "#ffffff",
  showCounter = true,
  beatTimestamps = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const beatScale = getBeatScale(frame, fps, beatTimestamps);

  const imageList = images.slice(0, 8);

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${beatScale})`,
      }}
    >
      
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 70,
          width: "100%",
          textAlign: "center",
          zIndex: 100,
          fontSize: 44,
          color: "#333",
          letterSpacing: 4,
          fontWeight: 300,
          fontFamily: "serif",
        }}
      >
        {title}
      </div>

      {/* Cards */}
      {imageList.map((img, index) => {
        const delay = index * 20;

        const enter = spring({
          fps,
          frame: frame - delay,
          config: {
            damping: 20,
            stiffness: 45,
            mass: 1.2,
          },
        });

        const stackRotate = [-16,-12, -7, -3, 3, 7, 12,16][index] ?? 0;

        const stackX = [-180,-130, -80, -30, 30, 80, 130,180][index] ?? 0;

        const stackY = [80,60, 35, 15, 0, 20, 45,80][index] ?? 0;

        const translateX = interpolate(
          enter,
          [0, 1],
          [-width, stackX]
        );

        const translateY = interpolate(
          enter,
          [0, 1],
          [height, stackY]
        );

        const rotate = interpolate(
          enter,
          [0, 1],
          [-25, stackRotate]
        );

        let scale = interpolate(
          enter,
          [0, 1],
          [0.75, 1]
        );

        const opacity = interpolate(
          enter,
          [0, 1],
          [0, 1]
        );

        // Last card zooms to fullscreen
        if (index === imageList.length - 1) {
          const zoom = spring({
            fps,
            frame: frame - (delay + 55),
            config: {
              damping: 18,
              stiffness: 60,
            },
          });

          scale = interpolate(
            zoom,
            [0, 1],
            [1, 1.55]
          );
        }

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: 650,
              height: 820,
              background: cardColor,
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 25px 50px rgba(0,0,0,.18)",
              transform: `
                translate(${translateX}px,${translateY}px)
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
                height: 650,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
                        {/* Bottom White Area */}
            <div
              style={{
                height: 120,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 12px",
                fontFamily: "cursive",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  color: "#444",
                  letterSpacing: 1,
                }}
              >
                Wedding Day
              </div>

              {showCounter && (
                <div
                  style={{
                    fontSize: 18,
                    color: "#888",
                    fontWeight: 600,
                  }}
                >
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(imageList.length).padStart(2, "0")}
                </div>
              )}
            </div>

            {/* Paper Texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                background:
                  "radial-gradient(circle at top left, rgba(255,255,255,.35), transparent 60%)",
                pointerEvents: "none",
              }}
            />

            {/* Small Tape */}
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
              }}
            />
          </div>
        );
      })}

      {/* Background Decoration */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,.4), transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      {/* Corner Decoration */}
      <div
        style={{
          position: "absolute",
          left: -150,
          top: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,220,220,.25)",
          filter: "blur(90px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: -180,
          bottom: -180,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "rgba(220,230,255,.22)",
          filter: "blur(100px)",
        }}
      />
    </AbsoluteFill>
  );
};

export default WhiteCardPolaroidStack;