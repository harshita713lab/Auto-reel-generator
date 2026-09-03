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

export const IMAGE_COUNT = 4;

export const FPS = 30;

export const DURATION_IN_FRAMES = 345;

// 11.5 seconds
// ======================================================


// ======================================================
// HELPERS
// ======================================================

const getStartFrame = (clip?: VideoClipItem) => {
  if (!clip?.startOffset) return 0;

  return Math.max(
    0,
    Math.round(clip.startOffset * FPS)
  );
};


// ======================================================
// VIDEO COMPONENT
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

  effect:
    | "zoomIn"
    | "zoomOut"
    | "panRight"
    | "panLeft"
    | "hero";

  playbackRate: number;
}) => {

  const frame = useCurrentFrame();


  // ====================================================
  // PROGRESS
  // ====================================================

  const progress = interpolate(
    frame,
    [0, duration],
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
    [0, 8],
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

  const fadeOut = interpolate(
    frame,
    [duration - 10, duration],
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
  // ZOOM
  // ====================================================

  let scale = 1;


  if (effect === "zoomIn") {

    scale = interpolate(
      frame,
      [0, duration],
      [1.02, 1.13],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  }


  if (effect === "zoomOut") {

    scale = interpolate(
      frame,
      [0, duration],
      [1.14, 1.02],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  }


  if (effect === "panRight") {

    scale = interpolate(
      frame,
      [0, duration],
      [1.07, 1.12],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  }


  if (effect === "panLeft") {

    scale = interpolate(
      frame,
      [0, duration],
      [1.07, 1.12],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  }


  // ====================================================
  // PAN
  // ====================================================

  let translateX = 0;

  let translateY = 0;


  if (effect === "panRight") {

    translateX = interpolate(
      frame,
      [0, duration],
      [-18, 18],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  }


  if (effect === "panLeft") {

    translateX = interpolate(
      frame,
      [0, duration],
      [18, -18],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  }


  // ====================================================
  // HERO VERTICAL MOVEMENT
  // ====================================================

  if (effect === "hero") {

    translateY = interpolate(
      frame,
      [0, duration],
      [10, -8],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    scale = interpolate(
      frame,
      [0, duration],
      [1.03, 1.15],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

  }


  // ====================================================
  // SUBTLE MOTION BLUR
  // ====================================================

  const blur = interpolate(
    frame,
    [0, 6, duration - 8, duration],
    [2.5, 0, 0, 1.8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );


  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",

        opacity,

        overflow: "hidden",
      }}
    >

      {/* VIDEO */}

      <div
        style={{
          position: "absolute",

          inset: -30,

          transform: `
            translate3d(
              ${translateX}px,
              ${translateY}px,
              0
            )
            scale(${scale})
          `,

          transformOrigin: "center center",

          filter: `
            blur(${blur}px)
            contrast(1.04)
            saturate(1.05)
          `,
        }}
      >

        <Video
          clip={clip}
          playbackRate={playbackRate}
        />

      </div>


      {/* =================================================
          CINEMATIC DARK GRADIENT
      ================================================= */}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 40%, rgba(0,0,0,0.45) 100%)",

          pointerEvents: "none",

          zIndex: 10,
        }}
      />


      {/* =================================================
          SOFT VIGNETTE
      ================================================= */}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.35) 100%)",

          pointerEvents: "none",

          zIndex: 11,
        }}
      />

    </AbsoluteFill>
  );
};


// ======================================================
// CINEMATIC TRANSITION
// ======================================================

const CinematicTransition = ({
  type,
}: {
  type:
    | "zoom"
    | "light"
    | "slide";
}) => {

  const frame = useCurrentFrame();


  // ====================================================
  // TRANSITION OPACITY
  // ====================================================

  const opacity = interpolate(
    frame,
    [0, 5, 12],
    [0, 0.55, 0],
    {
      easing: Easing.inOut(Easing.cubic),

      extrapolateLeft: "clamp",

      extrapolateRight: "clamp",
    }
  );


  // ====================================================
  // SCALE
  // ====================================================

  const scale = interpolate(
    frame,
    [0, 12],
    [1.18, 1],
    {
      easing: Easing.out(Easing.cubic),

      extrapolateLeft: "clamp",

      extrapolateRight: "clamp",
    }
  );


  // ====================================================
  // SLIDE
  // ====================================================

  const slideX = interpolate(
    frame,
    [0, 12],
    [-120, 120],
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

          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.28), transparent 65%)",

          opacity,

          transform: `scale(${scale})`,

          filter: "blur(5px)",
        }}
      />
    );

  }


  // ====================================================
  // LIGHT TRANSITION
  // ====================================================

  if (type === "light") {

    return (
      <AbsoluteFill
        style={{
          zIndex: 500,

          pointerEvents: "none",

          background:
            "radial-gradient(circle at 50% 45%, rgba(255,220,180,0.32), transparent 65%)",

          opacity,

          filter: "blur(8px)",
        }}
      />
    );

  }


  // ====================================================
  // SLIDE LIGHT
  // ====================================================

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

          top: "-20%",

          left: "-45%",

          width: "45%",

          height: "140%",

          transform: `
            rotate(12deg)
            translateX(${slideX * 6}px)
          `,

          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",

          filter: "blur(10px)",

          opacity,
        }}
      />

    </AbsoluteFill>
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


  const opacity = interpolate(
    frame,
    [0, 8, duration - 10, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",

      extrapolateRight: "clamp",
    }
  );


  const translateY = interpolate(
    frame,
    [0, 12],
    [20, 0],
    {
      easing: Easing.out(Easing.cubic),

      extrapolateLeft: "clamp",

      extrapolateRight: "clamp",
    }
  );


  const scale = interpolate(
    frame,
    [0, 12],
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

        zIndex: 600,

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

          fontSize: 34,

          fontWeight: 600,

          fontFamily:
            "'Times New Roman', Georgia, serif",

          textAlign: "center",

          letterSpacing: "0.5px",

          textShadow:
            "0 2px 10px rgba(0,0,0,0.95)",

          padding:
            "8px 22px",
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
        zIndex: 700,

        pointerEvents: "none",
      }}
    >

      <div
        style={{
          position: "absolute",

          right: 25,

          bottom: 25,

          color:
            "rgba(255,255,255,0.72)",

          fontSize: 13,

          fontWeight: 600,

          fontFamily:
            "Arial, Helvetica, sans-serif",

          letterSpacing: "1.3px",

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

export const VideoTemplate2: React.FC<
  WeddingReelProps
> = ({
  media,
  musicPath,
}) => {

  // ====================================================
  // VALIDATION
  // ====================================================

  if (!media || media.length !== 4) {
    throw new Error(
      `VideoTemplate2 requires EXACTLY 4 clips. Received: ${
        media?.length ?? 0
      }`
    );
  }


  const clip1 = media[0];
  const clip2 = media[1];
  const clip3 = media[2];
  const clip4 = media[3];


  if (
    !clip1?.path ||
    !clip2?.path ||
    !clip3?.path ||
    !clip4?.path
  ) {
    throw new Error(
      "All 4 video paths are required."
    );
  }


  console.log(
    "🎬 VideoTemplate2 Cinematic Render"
  );

  console.log(
    "🎥 Clip 1:",
    clip1.path
  );

  console.log(
    "🎥 Clip 2:",
    clip2.path
  );

  console.log(
    "🎥 Clip 3:",
    clip3.path
  );

  console.log(
    "🎥 Clip 4:",
    clip4.path
  );

  console.log(
    "🎵 Music:",
    musicPath
  );


  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",

        overflow: "hidden",
      }}
    >

      {/* =================================================
          MUSIC
      ================================================= */}

      {musicPath && (
        <Audio
          src={musicPath}
          volume={0.85}
        />
      )}


      {/* =================================================
          CLIP 1
          0 - 2.8 SEC
          SLOW CINEMATIC ZOOM
      ================================================= */}

      <Sequence
        from={0}
        durationInFrames={85}
      >

        <CinematicScene
          clip={clip1}
          duration={85}
          effect="zoomIn"

          // normal but cinematic
          playbackRate={0.9}
        />

      </Sequence>


      {/* =================================================
          TRANSITION 1
      ================================================= */}

      <Sequence
        from={80}
        durationInFrames={15}
      >

        <CinematicTransition
          type="zoom"
        />

      </Sequence>


      {/* =================================================
          CLIP 2
          2.7 - 5.5 SEC
          SLOW MOTION
      ================================================= */}

      <Sequence
        from={80}
        durationInFrames={85}
      >

        <CinematicScene
          clip={clip2}
          duration={85}
          effect="zoomOut"

          // 🔥 SLOW MOTION
          playbackRate={0.65}
        />

      </Sequence>


      {/* =================================================
          TRANSITION 2
      ================================================= */}

      <Sequence
        from={165}
        durationInFrames={15}
      >

        <CinematicTransition
          type="light"
        />

      </Sequence>


      {/* =================================================
          CLIP 3
          5.5 - 8.3 SEC
          PAN + ZOOM
      ================================================= */}

      <Sequence
        from={165}
        durationInFrames={85}
      >

        <CinematicScene
          clip={clip3}
          duration={85}
          effect="panRight"

          playbackRate={0.82}
        />

      </Sequence>


      {/* =================================================
          TRANSITION 3
      ================================================= */}

      <Sequence
        from={250}
        durationInFrames={15}
      >

        <CinematicTransition
          type="slide"
        />

      </Sequence>


      {/* =================================================
          CLIP 4
          8.3 - 11.5 SEC
          HERO ENDING
      ================================================= */}

      <Sequence
        from={250}
        durationInFrames={95}
      >

        <CinematicScene
          clip={clip4}
          duration={95}
          effect="hero"

          // 🔥 slow romantic ending
          playbackRate={0.72}
        />

      </Sequence>


      {/* =================================================
          FINAL LIGHT
      ================================================= */}

      <Sequence
        from={325}
        durationInFrames={20}
      >

        <CinematicTransition
          type="light"
        />

      </Sequence>


      {/* =================================================
          LYRICS
      ================================================= */}

      <Lyrics
        text="You are my home ❤️"
        from={10}
        duration={65}
      />

      <Lyrics
        text="With you, everything feels right ✨"
        from={90}
        duration={65}
      />

      <Lyrics
        text="Forever starts with you 🤍"
        from={175}
        duration={65}
      />

      <Lyrics
        text="My favorite love story ❤️"
        from={260}
        duration={75}
      />


      {/* =================================================
          WATERMARK
      ================================================= */}

      <Watermark />

    </AbsoluteFill>
  );
};


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default VideoTemplate2;