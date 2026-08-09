import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";



interface ImageItem {
  path: string;
}

interface WeddingEditorialCompositionProps {
  images?: ImageItem[];

  music?: {
    path: string;
    volume?: number;
  };
}

export const WeddingEditorialComposition = ({
  images = [],
  music,
}: WeddingEditorialCompositionProps) => {

  // ==========================
  // Hooks
  // ==========================

  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ==========================
  // Scene Durations
  // ==========================

  const heroDuration = 60;
  const editorialDuration = 60;
  const stripDuration = 60;
  const horizontalDuration = 60;
  const splitDuration = 60;
  const fastDuration = 90;
  const endingDuration = 90;

  // ==========================
  // Total Duration
  // ==========================

  const totalDuration =
    heroDuration +
    editorialDuration +
    stripDuration +
    horizontalDuration +
    splitDuration +
    fastDuration +
    endingDuration;

  // ==========================
  // Scene Frames
  // ==========================

  const heroFrame = frame;

  const editorialFrame = frame - heroDuration;

  const stripFrame =
    frame -
    heroDuration -
    editorialDuration;

  const horizontalFrame =
    frame -
    heroDuration -
    editorialDuration -
    stripDuration;

  const splitFrame =
    frame -
    heroDuration -
    editorialDuration -
    stripDuration -
    horizontalDuration;

  const fastFrame =
    frame -
    heroDuration -
    editorialDuration -
    stripDuration -
    horizontalDuration -
    splitDuration;

  const endingFrame =
    frame -
    heroDuration -
    editorialDuration -
    stripDuration -
    horizontalDuration -
    splitDuration -
    fastDuration;

  // ==========================
  // Animations
  // ==========================

  // Hero Animation
  // ==========================
// Hero Animation
// ==========================

const heroOpacity = interpolate(
  heroFrame,
  [0, 15],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const heroScale = interpolate(
  heroFrame,
  [0, heroDuration],
  [1.08, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const heroTranslateY = interpolate(
  heroFrame,
  [0, heroDuration],
  [20, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);
const heroRotate = interpolate(
  heroFrame,
  [0, heroDuration],
  [-2, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);
  // Editorial Animation
// ==========================
// Scene 2 Animation
// ==========================

const editorialScale = interpolate(
  editorialFrame,
  [0, editorialDuration],
  [1.08, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const editorialX = interpolate(
  editorialFrame,
  [0, 25],
  [120, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const panelOpacity = interpolate(
  editorialFrame,
  [10, 30],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const lineWidth = interpolate(
  editorialFrame,
  [20, 50],
  [0, 100],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);
  // Strip Animation
// ==========================
// Scene 3 Animation
// ==========================

const stripScale = interpolate(
  stripFrame,
  [0, stripDuration],
  [1.08, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);
  // Horizontal Animation
// ==========================
// Scene 4 Animation
// ==========================

const maskHeight = interpolate(
  horizontalFrame,
  [0, 20, 40, horizontalDuration],
  [0, 180, 1080, 1080],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const horizontalScale = interpolate(
  horizontalFrame,
  [0, horizontalDuration],
  [1.1, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const secondImageOpacity = interpolate(
  horizontalFrame,
  [35, 55],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);
  // Split Animation
const topY = interpolate(
  splitFrame,
  [0, 25],
  [-250, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const bottomY = interpolate(
  splitFrame,
  [0, 25],
  [250, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const splitScale = interpolate(
  splitFrame,
  [0, splitDuration],
  [1.08, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);
  // Fast Animation
// ==========================
// Scene 6 Animation
// ==========================

const img1Frame = fastFrame;
const img2Frame = fastFrame - 22;
const img3Frame = fastFrame - 44;
const img4Frame = fastFrame - 66;
  // Ending Animation
  // ==========================
// Scene 7 Animation
// ==========================

const endingScale = interpolate(
  endingFrame,
  [0, endingDuration],
  [1.15, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const endingOpacity = interpolate(
  endingFrame,
  [0, 15, 75, endingDuration],
  [0, 1, 1, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const finalTextOpacity = interpolate(
  endingFrame,
  [20, 40],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const secondOpacity = interpolate(
  endingFrame,
  [55, 75],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
      }}
    >

      {/* Music */}


      {/* ======================
          Scene 1
      ======================= */}
{/* ==========================
        SCENE 1 - HERO
========================== */}

<Sequence from={0} durationInFrames={heroDuration}>
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f8f8",
    }}
  >
    <div
      style={{
        width: "88%",
        height: "88%",
        overflow: "hidden",
        borderRadius: 25,
        border: "10px solid white",
        boxShadow: "0 15px 40px rgba(0,0,0,0.18)",
        opacity: heroOpacity,
      }}
    >
      <Img
        src={images[0]?.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateY(${heroTranslateY}px) scale(${heroScale}) rotate(${heroRotate}deg)`,
        }}
      />
    </div>
  </AbsoluteFill>
</Sequence>

      {/* ======================
          Scene 2
      ======================= */}

    {/* ==========================
        SCENE 2
========================== */}

<Sequence
  from={heroDuration}
  durationInFrames={editorialDuration}
>
<AbsoluteFill
  style={{
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <div
    style={{
      width: "92%",
      height: "88%",
      display: "flex",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      background: "#fff",
    }}
  >
    {/* Image */}
    <div
      style={{
        flex: 1,
        overflow: "hidden",
      }}
    ><Img
  src={images[1]?.path}
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "blur(30px)",
    transform: "scale(1.2)",
    opacity: 0.35,
  }}
/>


      <Img
        src={images[1]?.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${editorialScale}) translateX(${editorialX}px)`,
        }}
      />
    </div>

    {/* Right Side */}
    <div
      style={{
        width: 320,
        padding: "70px 40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#ffffff",
        opacity: panelOpacity,
      }}
    >
      <div
        style={{
          fontSize: 14,
          letterSpacing: 5,
          color: "#888",
          textTransform: "uppercase",
        }}
      >
        Editorial
      </div>

      <div
        style={{
          fontSize: 54,
          fontWeight: 600,
          marginTop: 18,
          lineHeight: 1.1,
        }}
      >
        Wedding
      </div>

      <div
        style={{
          marginTop: 30,
          width: lineWidth,
          height: 2,
          background: "#111",
        }}
      />

      <div
        style={{
          marginTop: 28,
          color: "#666",
          fontSize: 18,
          lineHeight: 1.7,
        }}
      >
        A timeless story of love,
        elegance and unforgettable
        moments.
      </div>
    </div>
  </div>
</AbsoluteFill>
</Sequence>

      {/* ======================
          Scene 3
      ======================= */}

     {/* ==========================
        SCENE 3
========================== */}

<Sequence
  from={heroDuration + editorialDuration}
  durationInFrames={stripDuration}
>
  <AbsoluteFill
    style={{
      backgroundColor: "#fff",
      flexDirection: "row",
    }}
  >
    {Array.from({ length: 20 }).map((_, i) => {

      const reveal = interpolate(
        stripFrame,
        [i * 2, 30 + i * 2],
        [0, 100],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );

      return (
        <div
          key={i}
          style={{
            width: "5%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Img
            src={images[2]?.path}
            style={{
              position: "absolute",
              left: `${-i * 100}%`,
              width: "2000%",
              height: `${reveal}%`,
              top: 0,
              objectFit: "cover",
              transform: `scale(${stripScale})`,
              transformOrigin: "center",
            }}
          />
        </div>
      );
    })}
  </AbsoluteFill>
</Sequence>

      {/* ======================
          Scene 4
      ======================= */}
{/* ==========================
        SCENE 4
========================== */}

<Sequence
  from={
    heroDuration +
    editorialDuration +
    stripDuration
  }
  durationInFrames={horizontalDuration}
>
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    }}
  >

    {/* First Image */}

    <div
      style={{
        width: "100%",
        height: maskHeight,
        overflow: "hidden",
      }}
    >
      <Img
        src={images[3]?.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${horizontalScale})`,
        }}
      />
    </div>

    {/* Second Image */}

    <Img
      src={images[4]?.path}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: secondImageOpacity,
      }}
    />

  </AbsoluteFill>
</Sequence>
      

      {/* ======================
          Scene 5
      ======================= */}

    {/* ==========================
        SCENE 5
========================== */}

<Sequence
  from={
    heroDuration +
    editorialDuration +
    stripDuration +
    horizontalDuration
  }
  durationInFrames={splitDuration}
>
  <AbsoluteFill
    style={{
      backgroundColor: "#fff",
    }}
  >

    {/* Top Image */}

    <div
      style={{
        width: "100%",
        height: "50%",
        overflow: "hidden",
        transform: `translateY(${topY}px)`,
      }}
    >
      <Img
        src={images[5]?.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${splitScale})`,
        }}
      />
    </div>

    {/* Bottom Image */}

    <div
      style={{
        width: "100%",
        height: "50%",
        overflow: "hidden",
        transform: `translateY(${bottomY}px)`,
      }}
    >
      <Img
        src={images[6]?.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${splitScale})`,
        }}
      />
    </div>

  </AbsoluteFill>
</Sequence>

      {/* ======================
          Scene 6
      ======================= */}

     {/* ==========================
        SCENE 6
========================== */}

<Sequence
  from={
    heroDuration +
    editorialDuration +
    stripDuration +
    horizontalDuration +
    splitDuration
  }
  durationInFrames={fastDuration}
>
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>

    {/* Image 1 */}

    <Img
      src={images[7]?.path}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: interpolate(img1Frame, [0, 5, 20, 22], [0, 1, 1, 0]),
        transform: `translateX(${interpolate(
          img1Frame,
          [0, 22],
          [80, 0]
        )}px) scale(${interpolate(img1Frame,[0,22],[1.08,1])})`,
      }}
    />

    {/* Image 2 */}

    <Img
      src={images[8]?.path}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: interpolate(img2Frame, [0, 5, 20, 22], [0, 1, 1, 0]),
        transform: `translateX(${interpolate(
          img2Frame,
          [0,22],
          [-80,0]
        )}px) scale(${interpolate(img2Frame,[0,22],[1.08,1])})`,
      }}
    />

    {/* Image 3 */}

    <Img
      src={images[9]?.path}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: interpolate(img3Frame, [0, 5, 20, 22], [0, 1, 1, 0]),
        transform: `translateY(${interpolate(
          img3Frame,
          [0,22],
          [-80,0]
        )}px) scale(${interpolate(img3Frame,[0,22],[1.08,1])})`,
      }}
    />

    {/* Image 4 */}

    <Img
      src={images[10]?.path}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: interpolate(img4Frame, [0, 5, 20, 22], [0, 1, 1, 1]),
        transform: `translateY(${interpolate(
          img4Frame,
          [0,22],
          [80,0]
        )}px) scale(${interpolate(img4Frame,[0,22],[1.08,1])})`,
      }}
    />

  </AbsoluteFill>
</Sequence>

      {/* ======================
          Scene 7
      ======================= */}
{/* ==========================
        SCENE 7
========================== */}

<Sequence
  from={
    heroDuration +
    editorialDuration +
    stripDuration +
    horizontalDuration +
    splitDuration +
    fastDuration
  }
  durationInFrames={endingDuration}
>
  <AbsoluteFill
    style={{
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
    }}
  >

    {/* Hero Image */}

    <Img
      src={images[11]?.path}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: endingOpacity,
        transform: `scale(${endingScale})`,
      }}
    />

    {/* Final Image */}

    <Img
      src={images[12]?.path}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: secondOpacity,
      }}
    />

    {/* Text */}

    <div
      style={{
        position: "absolute",
        bottom: 140,
        color: "#fff",
        fontSize: 56,
        fontWeight: 600,
        letterSpacing: 6,
        opacity: finalTextOpacity,
        textShadow: "0 4px 20px rgba(0,0,0,.4)",
      }}
    >
      WEDDING STORY
    </div>

  </AbsoluteFill>
</Sequence>
     

    </AbsoluteFill>
  );
};