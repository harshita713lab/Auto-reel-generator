import React from "react";

import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";

// ======================================================
// TYPES
// ======================================================

export interface VideoClipItem {
  path: string;
  duration?: number;
  startOffset?: number;
  muted?: boolean;
}

export interface WeddingReelProps {
  media: VideoClipItem[];
  musicPath?: string;
}

// ======================================================
// CONFIG
// ======================================================

export const IMAGE_COUNT = 5;

export const FPS = 30;

// EXACTLY 15 SECONDS
export const DURATION_IN_FRAMES = 450;

// ======================================================
// HELPERS
// ======================================================

const getStartFrame = (clip?: VideoClipItem) => {
  if (!clip?.startOffset) {
    return 0;
  }

  return Math.max(
    0,
    Math.round(clip.startOffset * FPS)
  );
};

// ======================================================
// VIDEO
// ======================================================

const Video = ({
  clip,
  playbackRate = 1,
}: {
  clip: VideoClipItem;
  playbackRate?: number;
}) => {
  return (
    <OffthreadVideo
      src={clip.path}
      startFrom={getStartFrame(clip)}
      playbackRate={playbackRate}
      volume={0}
      pauseWhenBuffering
      style={{
        position: "absolute",
        inset: 0,

        width: "100%",
        height: "100%",

        objectFit: "cover",
        objectPosition: "center center",

        display: "block",
      }}
    />
  );
};

// ======================================================
// CINEMATIC COLOR OVERLAY
// ======================================================

const CinematicOverlay = () => {
  return (
    <AbsoluteFill
      style={{
        zIndex: 10,
        pointerEvents: "none",

        background:
          "linear-gradient(" +
          "180deg," +
          "rgba(0,0,0,0.16) 0%," +
          "rgba(0,0,0,0.00) 38%," +
          "rgba(0,0,0,0.08) 60%," +
          "rgba(0,0,0,0.55) 100%" +
          ")",
      }}
    />
  );
};

// ======================================================
// VIGNETTE
// ======================================================

const Vignette = () => {
  return (
    <AbsoluteFill
      style={{
        zIndex: 11,
        pointerEvents: "none",

        background:
          "radial-gradient(" +
          "circle at center," +
          "transparent 48%," +
          "rgba(0,0,0,0.42) 100%" +
          ")",
      }}
    />
  );
};

// ======================================================
// SCENE EFFECTS
// ======================================================

type SceneEffect =
  | "zoomIn"
  | "zoomOut"
  | "panLeft"
  | "panRight"
  | "hero";

// ======================================================
// CINEMATIC SCENE
// ======================================================

const CinematicScene = ({
  clip,
  duration,
  effect,
  playbackRate,
}: {
  clip: VideoClipItem;

  duration: number;

  effect: SceneEffect;

  playbackRate: number;
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // PROGRESS
  // ====================================================

  const progress = interpolate(
    frame,
    [0, Math.max(1, duration - 1)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // FADE IN
  // ====================================================

  const fadeIn = interpolate(
    frame,
    [0, 10],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),

      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // FADE OUT
  // ====================================================

  const fadeOutStart = Math.max(
    10,
    duration - 12
  );

  const fadeOut = interpolate(
    frame,
    [fadeOutStart, duration],
    [1, 0],
    {
      easing: Easing.in(Easing.cubic),

      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(
    fadeIn,
    fadeOut
  );

  // ====================================================
  // CAMERA SCALE
  // ====================================================

  let scale = 1;

  // ----------------------------------------------------
  // ZOOM IN
  // ----------------------------------------------------

  if (effect === "zoomIn") {
    scale = interpolate(
      progress,
      [0, 0.5, 1],
      [1.02, 1.08, 1.15],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  // ----------------------------------------------------
  // ZOOM OUT
  // ----------------------------------------------------

  if (effect === "zoomOut") {
    scale = interpolate(
      progress,
      [0, 0.5, 1],
      [1.15, 1.08, 1.02],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  // ----------------------------------------------------
  // PAN LEFT
  // ----------------------------------------------------

  if (effect === "panLeft") {
    scale = interpolate(
      progress,
      [0, 0.5, 1],
      [1.10, 1.13, 1.16],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  // ----------------------------------------------------
  // PAN RIGHT
  // ----------------------------------------------------

  if (effect === "panRight") {
    scale = interpolate(
      progress,
      [0, 0.5, 1],
      [1.10, 1.13, 1.16],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  // ----------------------------------------------------
  // HERO
  // ----------------------------------------------------

  if (effect === "hero") {
    scale = interpolate(
      progress,
      [0, 0.5, 1],
      [1.03, 1.10, 1.20],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  // ====================================================
  // X CAMERA MOVEMENT
  // ====================================================

  let translateX = 0;

  if (effect === "zoomIn") {
    translateX = interpolate(
      progress,
      [0, 1],
      [8, -8],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  if (effect === "zoomOut") {
    translateX = interpolate(
      progress,
      [0, 1],
      [-8, 8],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  if (effect === "panLeft") {
    translateX = interpolate(
      progress,
      [0, 1],
      [38, -38],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  if (effect === "panRight") {
    translateX = interpolate(
      progress,
      [0, 1],
      [-38, 38],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  if (effect === "hero") {
    translateX = interpolate(
      progress,
      [0, 1],
      [5, -8],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  // ====================================================
  // Y CAMERA MOVEMENT
  // ====================================================

  let translateY = 0;

  if (effect === "zoomIn") {
    translateY = interpolate(
      progress,
      [0, 1],
      [5, -8],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  if (effect === "zoomOut") {
    translateY = interpolate(
      progress,
      [0, 1],
      [-6, 6],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  if (effect === "panLeft") {
    translateY = interpolate(
      progress,
      [0, 1],
      [-5, 5],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  if (effect === "panRight") {
    translateY = interpolate(
      progress,
      [0, 1],
      [5, -5],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  if (effect === "hero") {
    translateY = interpolate(
      progress,
      [0, 1],
      [7, -10],
      {
        easing: Easing.inOut(Easing.cubic),
      }
    );
  }

  // ====================================================
  // ROTATION
  // ====================================================

  let rotate = 0;

  if (effect === "panLeft") {
    rotate = interpolate(
      progress,
      [0, 0.5, 1],
      [0.18, 0, -0.18],
      {
        easing: Easing.inOut(Easing.ease),
      }
    );
  }

  if (effect === "panRight") {
    rotate = interpolate(
      progress,
      [0, 0.5, 1],
      [-0.18, 0, 0.18],
      {
        easing: Easing.inOut(Easing.ease),
      }
    );
  }

  if (
    effect === "zoomIn" ||
    effect === "zoomOut"
  ) {
    rotate = interpolate(
      progress,
      [0, 0.5, 1],
      [-0.12, 0, 0.12],
      {
        easing: Easing.inOut(Easing.ease),
      }
    );
  }

  // ====================================================
  // SUBTLE MOTION BLUR
  // ====================================================

  const blur = interpolate(
    frame,
    [
      0,
      6,
      Math.max(7, duration - 8),
      duration,
    ],
    [1.8, 0, 0, 1.8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // BRIGHTNESS
  // ====================================================

  const brightness = interpolate(
    progress,
    [0, 0.5, 1],
    [0.98, 1.02, 0.99],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // CAMERA ORIGIN
  // ====================================================

  let transformOrigin =
    "center center";

  if (effect === "panLeft") {
    transformOrigin = "left center";
  }

  if (effect === "panRight") {
    transformOrigin = "right center";
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",

        opacity,

        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",

          inset: -40,

          transform: `
            translate3d(
              ${translateX}px,
              ${translateY}px,
              0
            )
            scale(${scale})
            rotate(${rotate}deg)
          `,

          transformOrigin,

          filter: `
            blur(${blur}px)
            brightness(${brightness})
            contrast(1.04)
            saturate(1.07)
          `,
        }}
      >
        <Video
          clip={clip}
          playbackRate={playbackRate}
        />
      </div>

      <CinematicOverlay />

      <Vignette />
    </AbsoluteFill>
  );
};

// ======================================================
// TRANSITION
// ======================================================

type TransitionType =
  | "zoom"
  | "whip"
  | "light";

// ======================================================
// CINEMATIC TRANSITION
// ======================================================

const CinematicTransition = ({
  type,
}: {
  type: TransitionType;
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // TRANSITION OPACITY
  // ====================================================

  const opacity = interpolate(
    frame,
    [0, 4, 8, 12, 16],
    [0, 0.25, 0.55, 0.18, 0],
    {
      easing: Easing.inOut(Easing.cubic),

      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // ZOOM
  // ====================================================

  const zoom = interpolate(
    frame,
    [0, 8, 16],
    [1.12, 1.04, 1],
    {
      easing: Easing.out(Easing.cubic),

      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // WHIP
  // ====================================================

  const whipX = interpolate(
    frame,
    [0, 5, 10, 16],
    [-120, -35, 45, 140],
    {
      easing: Easing.inOut(Easing.cubic),

      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // ZOOM TRANSITION
  // ====================================================

  if (type === "zoom") {
    return (
      <AbsoluteFill
        style={{
          zIndex: 500,

          pointerEvents: "none",

          overflow: "hidden",

          opacity,

          transform:
            `scale(${zoom})`,

          background:
            "radial-gradient(" +
            "circle at center," +
            "rgba(255,255,255,0.16)," +
            "rgba(255,255,255,0.03) 35%," +
            "transparent 70%" +
            ")",

          filter: "blur(6px)",
        }}
      />
    );
  }

  // ====================================================
  // WHIP TRANSITION
  // ====================================================

  if (type === "whip") {
    return (
      <AbsoluteFill
        style={{
          zIndex: 500,

          pointerEvents: "none",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",

            top: "-30%",

            left: "-45%",

            width: "32%",

            height: "160%",

            transform: `
              rotate(12deg)
              translateX(${whipX * 6}px)
            `,

            background:
              "linear-gradient(" +
              "90deg," +
              "transparent," +
              "rgba(255,255,255,0.35)," +
              "transparent" +
              ")",

            filter: "blur(13px)",

            opacity,
          }}
        />
      </AbsoluteFill>
    );
  }

  // ====================================================
  // LIGHT TRANSITION
  // ====================================================

  return (
    <AbsoluteFill
      style={{
        zIndex: 500,

        pointerEvents: "none",

        opacity,

        background:
          "radial-gradient(" +
          "circle at 50% 45%," +
          "rgba(255,220,185,0.30)," +
          "rgba(255,210,170,0.08) 35%," +
          "transparent 70%" +
          ")",

        filter: "blur(12px)",
      }}
    />
  );
};

// ======================================================
// LYRICS
// ======================================================

const Lyrics = ({
  text,
  from,
  duration,
}: {
  text: string;

  from: number;

  duration: number;
}) => {
  return (
    <Sequence
      from={from}
      durationInFrames={duration}
    >
      <LyricsContent
        text={text}
        duration={duration}
      />
    </Sequence>
  );
};

// ======================================================
// LYRICS CONTENT
// ======================================================

const LyricsContent = ({
  text,
  duration,
}: {
  text: string;

  duration: number;
}) => {
  const frame = useCurrentFrame();

  // ====================================================
  // OPACITY
  // ====================================================

  const opacity = interpolate(
    frame,
    [0, 10, duration - 12, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // Y MOVEMENT
  // ====================================================

  const translateY = interpolate(
    frame,
    [0, 16],
    [24, 0],
    {
      easing: Easing.out(Easing.cubic),

      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ====================================================
  // SCALE
  // ====================================================

  const scale = interpolate(
    frame,
    [0, 16],
    [0.94, 1],
    {
      easing: Easing.out(Easing.cubic),

      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",

        alignItems: "center",

        paddingBottom: 105,

        zIndex: 100,

        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,

          transform: `
            translateY(${translateY}px)
            scale(${scale})
          `,

          color: "#fff",

          fontSize: 36,

          fontWeight: 700,

          fontFamily:
            "'Times New Roman', Georgia, serif",

          textAlign: "center",

          letterSpacing: "0.7px",

          maxWidth: "88%",

          lineHeight: 1.25,

          textShadow:
            "0 3px 12px rgba(0,0,0,0.95), " +
            "0 0 18px rgba(255,210,170,0.35)",

          padding:
            "8px 25px",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// WATERMARK
// ======================================================

const Watermark = () => {
  return (
    <AbsoluteFill
      style={{
        zIndex: 200,

        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",

          right: 30,

          bottom: 30,

          color:
            "rgba(255,255,255,0.78)",

          fontSize: 13,

          fontWeight: 700,

          fontFamily:
            "Arial, sans-serif",

          letterSpacing: "1.4px",

          textShadow:
            "0 2px 7px rgba(0,0,0,0.9)",
        }}
      >
        @yourname
      </div>
    </AbsoluteFill>
  );
};

// ======================================================
// MAIN TEMPLATE
// ======================================================

export const VideoTemplate5Clips: React.FC<
  WeddingReelProps
> = ({
  media,
  musicPath,
}) => {
  // ====================================================
  // VALIDATION
  // ====================================================

  if (!media || media.length !== 5) {
    throw new Error(
      `❌ VideoTemplate5Clips requires EXACTLY 5 clips. Received: ${
        media?.length ?? 0
      }`
    );
  }

  const [
    clip1,
    clip2,
    clip3,
    clip4,
    clip5,
  ] = media;

  // ====================================================
  // DEBUG
  // ====================================================

  console.log(
    "===================================="
  );

  console.log(
    "🎬 VIDEO TEMPLATE 5 CLIPS"
  );

  console.log(
    "🎥 CLIP 1:",
    clip1.path
  );

  console.log(
    "🎥 CLIP 2:",
    clip2.path
  );

  console.log(
    "🎥 CLIP 3:",
    clip3.path
  );

  console.log(
    "🎥 CLIP 4:",
    clip4.path
  );

  console.log(
    "🎥 CLIP 5:",
    clip5.path
  );

  console.log(
    "🎵 MUSIC:",
    musicPath
  );

  console.log(
    "===================================="
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",

        overflow: "hidden",
      }}
    >
      {/* ==================================================
          MUSIC
      ================================================== */}

      {musicPath && (
        <Audio
          src={musicPath}
          volume={0.85}
        />
      )}

      {/* ==================================================
          CLIP 1
          0.00s → 3.27s

          EFFECT:
          PUSH IN
      ================================================== */}

      <Sequence
        from={0}
        durationInFrames={98}
        premountFor={15}
      >
        <CinematicScene
          clip={clip1}
          duration={98}
          effect="zoomIn"
          playbackRate={0.90}
        />
      </Sequence>

      {/* ==================================================
          TRANSITION 1
          2.80s → 3.33s
      ================================================== */}

      <Sequence
        from={84}
        durationInFrames={16}
      >
        <CinematicTransition
          type="zoom"
        />
      </Sequence>

      {/* ==================================================
          CLIP 2
          3.00s → 6.27s

          EFFECT:
          SLOW MOTION + PULL OUT
      ================================================== */}

      <Sequence
        from={90}
        durationInFrames={98}
        premountFor={15}
      >
        <CinematicScene
          clip={clip2}
          duration={98}
          effect="zoomOut"

          // ACTUAL SLOW MOTION
          playbackRate={0.65}
        />
      </Sequence>

      {/* ==================================================
          TRANSITION 2

          WHIP
      ================================================== */}

      <Sequence
        from={174}
        durationInFrames={16}
      >
        <CinematicTransition
          type="whip"
        />
      </Sequence>

      {/* ==================================================
          CLIP 3
          6.00s → 9.27s

          EFFECT:
          PAN RIGHT
      ================================================== */}

      <Sequence
        from={180}
        durationInFrames={98}
        premountFor={15}
      >
        <CinematicScene
          clip={clip3}
          duration={98}
          effect="panRight"
          playbackRate={0.88}
        />
      </Sequence>

      {/* ==================================================
          TRANSITION 3

          SOFT LIGHT
      ================================================== */}

      <Sequence
        from={264}
        durationInFrames={16}
      >
        <CinematicTransition
          type="light"
        />
      </Sequence>

      {/* ==================================================
          CLIP 4
          9.00s → 12.27s

          EFFECT:
          PAN LEFT
      ================================================== */}

      <Sequence
        from={270}
        durationInFrames={98}
        premountFor={15}
      >
        <CinematicScene
          clip={clip4}
          duration={98}
          effect="panLeft"
          playbackRate={0.82}
        />
      </Sequence>

      {/* ==================================================
          TRANSITION 4

          ZOOM
      ================================================== */}

      <Sequence
        from={354}
        durationInFrames={16}
      >
        <CinematicTransition
          type="zoom"
        />
      </Sequence>

      {/* ==================================================
          CLIP 5
          12.00s → 15.00s

          HERO ENDING
      ================================================== */}

      <Sequence
        from={360}
        durationInFrames={90}
        premountFor={15}
      >
        <CinematicScene
          clip={clip5}
          duration={90}
          effect="hero"

          // SLOW ROMANTIC ENDING
          playbackRate={0.72}
        />
      </Sequence>

      {/* ==================================================
          LYRICS
      ================================================== */}

      <Lyrics
        text="Aankhon ko meech..."
        from={12}
        duration={68}
      />

      <Lyrics
        text="Main tere peeche peeche..."
        from={102}
        duration={68}
      />

      <Lyrics
        text="Chal dun jo kehde..."
        from={192}
        duration={68}
      />

      <Lyrics
        text="Tu abhi..."
        from={282}
        duration={68}
      />

      <Lyrics
        text="Forever & Always ❤️"
        from={372}
        duration={68}
      />

      {/* ==================================================
          WATERMARK
      ================================================== */}

      <Watermark />
    </AbsoluteFill>
  );
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default VideoTemplate5Clips;