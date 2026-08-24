import React from "react";
import {
  AbsoluteFill,
  Sequence,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

export interface VideoClipItem {
  path: string;
  duration?: number;
  startOffset?: number;
  muted?: boolean;
}

export interface VideoTemplate1Props {
  images?: VideoClipItem[];
  media?: VideoClipItem[];
  videos?: VideoClipItem[];
}

export const IMAGE_COUNT = 3;
export const DURATION_IN_FRAMES = 360; // 12 Seconds @ 30fps

// =========================================================================
// SCENE 1: MOTION COLLAGE GRID (0s - 3s / Frames 0-90)
// All 3 video clips play SIMULTANEOUSLY in an animated 3-box collage grid!
// =========================================================================
const SceneCollageGrid: React.FC<{
  clip1: VideoClipItem;
  clip2: VideoClipItem;
  clip3: VideoClipItem;
}> = ({ clip1, clip2, clip3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation for the collage grid boxes
  const cardScale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const cardRotate = interpolate(frame, [0, 90], [-2, 2], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0c",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Animated Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(15,23,42,1) 80%)",
        }}
      />

      {/* Title Header */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          width: "100%",
          textAlign: "center",
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "36px",
          fontWeight: 800,
          letterSpacing: "3px",
          textTransform: "uppercase",
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          zIndex: 10,
        }}
      >
        ✨ HIGHLIGHTS ✨
      </div>

      {/* 3-Video Motion Collage Layout */}
      <div
        style={{
          width: "90%",
          height: "75%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1.2fr 1fr",
          gap: "14px",
          transform: `scale(${cardScale}) rotate(${cardRotate}deg)`,
          zIndex: 5,
        }}
      >
        {/* Main Large Left Box - Clip 1 */}
        <div
          style={{
            gridRow: "span 2",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            border: "3px solid rgba(255,255,255,0.2)",
            position: "relative",
          }}
        >
          <OffthreadVideo
            src={clip1.path}
            startFrom={Math.round((clip1.startOffset || 0) * 30)}
            volume={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "10px",
            }}
          >
            CLIP 01
          </div>
        </div>

        {/* Top Right Box - Clip 2 */}
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            border: "3px solid rgba(255,255,255,0.2)",
            position: "relative",
          }}
        >
          <OffthreadVideo
            src={clip2.path}
            startFrom={Math.round((clip2.startOffset || 0) * 30)}
            volume={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "10px",
            }}
          >
            CLIP 02
          </div>
        </div>

        {/* Bottom Right Box - Clip 3 */}
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            border: "3px solid rgba(255,255,255,0.2)",
            position: "relative",
          }}
        >
          <OffthreadVideo
            src={clip3.path}
            startFrom={Math.round((clip3.startOffset || 0) * 30)}
            volume={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "10px",
            }}
          >
            CLIP 03
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 2: CLIP 01 SPOTLIGHT - CINEMATIC SLOW-MOTION (3s - 6s / Frames 90-180)
// Features 0.65x Slow-Mo speed ramp with smooth Ken-Burns pan!
// =========================================================================
const SceneClip1Spotlight: React.FC<{ clip: VideoClipItem }> = ({ clip }) => {
  const frame = useCurrentFrame();

  // Slow-Mo Ken-Burns Zoom
  const scale = interpolate(frame, [0, 90], [1.0, 1.15], {
    easing: Easing.ease,
    extrapolateRight: "clamp",
  });

  // Entrance Whip Transition
  const translateX = interpolate(frame, [0, 15], [-100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
        transform: `translateX(${translateX}%)`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={clip.path}
          startFrom={Math.round((clip.startOffset || 0) * 30)}
          playbackRate={0.65} // 🎬 Cinematic Slow-Motion!
          volume={clip.muted !== false ? 0 : 1}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Slow-Mo Badge */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          background: "linear-gradient(135deg, #f43f5e, #e11d48)",
          color: "#fff",
          padding: "6px 16px",
          borderRadius: "20px",
          fontWeight: 800,
          fontSize: "14px",
          letterSpacing: "1px",
          boxShadow: "0 10px 25px rgba(225,29,72,0.5)",
        }}
      >
        🎬 SLOW MOTION (0.65x)
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 3: CLIP 02 SPOTLIGHT - FAST-MOTION SPEED RAMP (6s - 9s / Frames 180-270)
// Features 1.6x Fast-Motion Speed Ramp with Flash Beat Cut!
// =========================================================================
const SceneClip2Spotlight: React.FC<{ clip: VideoClipItem }> = ({ clip }) => {
  const frame = useCurrentFrame();

  // Flash Effect on Entrance
  const flashOpacity = interpolate(frame, [0, 8], [1, 0], {
    extrapolateRight: "clamp",
  });

  // Dynamic Bounce Scale
  const scale = interpolate(frame, [0, 45, 90], [1.0, 1.08, 1.02], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={clip.path}
          startFrom={Math.round((clip.startOffset || 0) * 30)}
          playbackRate={1.6} // ⚡ Fast-Motion Speed Ramp!
          volume={clip.muted !== false ? 0 : 1}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Entrance White Flash Cut Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Fast Motion Badge */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          color: "#fff",
          padding: "6px 16px",
          borderRadius: "20px",
          fontWeight: 800,
          fontSize: "14px",
          letterSpacing: "1px",
          boxShadow: "0 10px 25px rgba(79,70,229,0.5)",
        }}
      >
        ⚡ FAST MOTION (1.6x)
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 4: CLIP 03 FINALE - SMOOTH OUTRO & LIGHT LEAK (9s - 12s / Frames 270-360)
// =========================================================================
const SceneClip3Finale: React.FC<{ clip: VideoClipItem }> = ({ clip }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 90], [1.1, 1.0], {
    easing: Easing.ease,
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={clip.path}
          startFrom={Math.round((clip.startOffset || 0) * 30)}
          playbackRate={1.0} // Normal Smooth Speed
          volume={clip.muted !== false ? 0 : 1}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Golden Light Leak Effect Overlay */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-20%",
          width: "80%",
          height: "80%",
          background:
            "radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// =========================================================================
// MAIN VIDEO TEMPLATE COMPONENT
// =========================================================================
export const VideoTemplate1: React.FC<VideoTemplate1Props> = ({
  images = [],
  media = [],
  videos = [],
}) => {
  const mediaList =
    videos.length > 0 ? videos : media.length > 0 ? media : images;

  const clip1 = mediaList[0] || { path: "" };
  const clip2 = mediaList[1] || mediaList[0] || { path: "" };
  const clip3 = mediaList[2] || mediaList[1] || mediaList[0] || { path: "" };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 🎬 SCENE 1 (0s - 3s): Motion Video Collage (All 3 Clips playing together!) */}
      <Sequence from={0} durationInFrames={90}>
        <SceneCollageGrid clip1={clip1} clip2={clip2} clip3={clip3} />
      </Sequence>

      {/* 🎬 SCENE 2 (3s - 6s): Clip 1 Spotlight - Slow Motion (0.65x) */}
      <Sequence from={90} durationInFrames={90}>
        <SceneClip1Spotlight clip={clip1} />
      </Sequence>

      {/* 🎬 SCENE 3 (6s - 9s): Clip 2 Spotlight - Fast Motion Speed Ramp (1.6x) */}
      <Sequence from={180} durationInFrames={90}>
        <SceneClip2Spotlight clip={clip2} />
      </Sequence>

      {/* 🎬 SCENE 4 (9s - 12s): Clip 3 Finale - Light Leak Smooth Outro */}
      <Sequence from={270} durationInFrames={90}>
        <SceneClip3Finale clip={clip3} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default VideoTemplate1;
