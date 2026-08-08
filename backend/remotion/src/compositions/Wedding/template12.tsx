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

// =======================
// TYPES
// =======================

interface ImageItem {
  path: string;
}

interface Wedding12CompositionProps {
  images?: ImageItem[];
}

// =======================
// COMPONENT
// =======================

export const Wedding12Composition = ({
  images = [],
}: Wedding12CompositionProps) => {

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // =======================
  // IMAGES
  // =======================

  const [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
  ] = images;

  // =======================
  // SCENE DURATIONS
  // =======================

  const scene1Duration = 75;   // Curtain
  const scene2Duration = 120;  // Triple Reveal
  const scene3Duration = 90;   // Magazine
  const scene4Duration = 120;  // Floating Mosaic
  const scene5Duration = 75;   // Polaroid
  const scene6Duration = 75;   // Hero Ending

  // =======================
  // TOTAL DURATION
  // =======================

  const totalDuration =
    scene1Duration +
    scene2Duration +
    scene3Duration +
    scene4Duration +
    scene5Duration +
    scene6Duration;

  // =======================
  // SCENE 1 ANIMATIONS
  // =======================
// =======================
// SCENE 1 ANIMATIONS
// =======================

const leftCurtainX = interpolate(
  frame,
  [0, 35],
  [0, -540],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const rightCurtainX = interpolate(
  frame,
  [0, 35],
  [0, -540],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const heroScale = interpolate(
  frame,
  [0, scene1Duration],
  [1, 1.06],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const titleOpacity = interpolate(
  frame,
  [20, 45],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);


  // =======================
  // SCENE 2 ANIMATIONS
  // =======================

// =======================
// SCENE 2 ANIMATIONS
// =======================

// Card 1
const scene2Frame = frame - scene1Duration;

const card1X = interpolate(scene2Frame, [0,20], [-1200,60], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
const card2X = interpolate(scene2Frame, [20,40], [-1200,60], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
const card3X = interpolate(scene2Frame, [40,60], [1200,60], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

const cardScale = interpolate(
  scene2Frame,
  [0, scene2Duration],
  [0.96, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

  // =======================
  // SCENE 3 ANIMATIONS
  // =======================

// =======================
// SCENE 3 ANIMATIONS
// =======================

const scene3Frame = frame - (scene1Duration + scene2Duration);

const bigCardY = interpolate(
  scene3Frame,
  [0, 20],
  [-250, 30],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const smallCardY = interpolate(
  scene3Frame,
  [20, 40],
  [250, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const magazineScale = interpolate(
  scene3Frame,
  [0, scene3Duration],
  [1.05, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const dividerOpacity = interpolate(
  scene3Frame,
  [15, 35],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

  // =======================
  // SCENE 4 ANIMATIONS
  // =======================
// =======================
// SCENE 4 ANIMATIONS
// =======================

const scene4Frame =
  frame -
  (
    scene1Duration +
    scene2Duration +
    scene3Duration
  );

const mosaicScale = interpolate(
  scene4Frame,
  [0, scene4Duration],
  [1.08, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const card7Y = interpolate(
  scene4Frame,
  [0, 20],
  [-250, 60],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const card8X = interpolate(
  scene4Frame,
  [20, 40],
  [-500, 70],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const card9X = interpolate(
  scene4Frame,
  [40, 60],
  [1200, 630],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const card10Y = interpolate(
  scene4Frame,
  [60, 80],
  [2200, 1160],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);


  // =======================
  // SCENE 5 ANIMATIONS
  // =======================
// =======================
// SCENE 5 ANIMATIONS
// =======================

const scene5Frame =
  frame -
  (
    scene1Duration +
    scene2Duration +
    scene3Duration +
    scene4Duration
  );

const polaroidY = interpolate(
  scene5Frame,
  [0, 25],
  [-900, 420],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const polaroidRotate = interpolate(
  scene5Frame,
  [0, 25],
  [-20, -6],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const polaroidBounce = interpolate(
  scene5Frame,
  [25, 35, 45],
  [420, 380, 420],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const shadowOpacity = interpolate(
  scene5Frame,
  [0, 25],
  [0, 0.4],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);


  // =======================
  // SCENE 6 ANIMATIONS
  // =======================

// =======================
// SCENE 6 ANIMATIONS
// =======================

const scene6Frame =
  frame -
  (
    scene1Duration +
    scene2Duration +
    scene3Duration +
    scene4Duration +
    scene5Duration
  );

const endingScale = interpolate(
  scene6Frame,
  [0, scene6Duration],
  [1, 1.08],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const endingOpacity = interpolate(
  scene6Frame,
  [0, 20],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const textY = interpolate(
  scene6Frame,
  [0, 25],
  [80, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const vignetteOpacity = interpolate(
  scene6Frame,
  [0, scene6Duration],
  [0.2, 0.5],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

  // =======================
  // COMMON HELPERS
  // =======================
const ImageView = ({
  src,
}: {
  src?: string;
}) => {
  return (
    <AbsoluteFill>

      {/* Blur Background */}

      <Img
        src={src ?? ""}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(30px) brightness(.45)",
          transform: "scale(1.2)",
        }}
      />

      {/* Main Image */}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Img
          src={src ?? ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: `scale(${heroScale})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const WhiteCard = ({
  src,
}: {
  src?: string;
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        borderRadius: 22,
        padding: 10,
        overflow: "hidden",
        boxShadow: "0 20px 45px rgba(0,0,0,.35)",
      }}
    >
      <Img
        src={src ?? ""}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: 16,
        }}
      />
    </div>
  );
};

  // =======================
  // RETURN
  // =======================

  return (
    <AbsoluteFill
      style={{
        background: "#000",
      }}
    >

      {/* ===================================== */}
      {/* SCENE 1 - CURTAIN */}
      {/* ===================================== */}

      <Sequence
        from={0}
        durationInFrames={scene1Duration}
      >
<AbsoluteFill>

  {/* Hero Image */}

  <ImageView src={img1?.path} />

  {/* Left Curtain */}

  <div
    style={{
      position: "absolute",
      top: 0,
      left: leftCurtainX,
      width: 540,
      height: "100%",
      background:
        "linear-gradient(to right,#050505,#1b1b1b)",
      zIndex: 10,
    }}
  />

  {/* Right Curtain */}

  <div
    style={{
      position: "absolute",
      top: 0,
      right: rightCurtainX,
      width: 540,
      height: "100%",
      background:
        "linear-gradient(to left,#050505,#1b1b1b)",
      zIndex: 10,
    }}
  />

  {/* Dark Overlay */}

  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to top,rgba(0,0,0,.45),transparent)",
      zIndex: 5,
    }}
  />

  {/* Title */}

  <div
    style={{
      position: "absolute",
      bottom: 180,
      width: "100%",
      textAlign: "center",
      color: "#fff",
      fontSize: 70,
      fontWeight: 800,
      letterSpacing: 8,
      opacity: titleOpacity,
      zIndex: 20,
      textShadow: "0 8px 25px rgba(0,0,0,.5)",
    }}
  >
    WEDDING FILM
  </div>

  {/* Subtitle */}

  <div
    style={{
      position: "absolute",
      bottom: 120,
      width: "100%",
      textAlign: "center",
      color: "#ddd",
      fontSize: 24,
      letterSpacing: 5,
      opacity: titleOpacity,
      zIndex: 20,
    }}
  >
    Every Picture Tells A Story
  </div>

</AbsoluteFill>
      </Sequence>

      {/* ===================================== */}
      {/* SCENE 2 - TRIPLE REVEAL */}
      {/* ===================================== */}

      <Sequence
        from={scene1Duration}
        durationInFrames={scene2Duration}
      >
<AbsoluteFill>

  {/* Blur Background */}
  <ImageView src={img2?.path} />

  {/* ---------- Card 1 ---------- */}

 <div
  style={{
    position: "absolute",
    top: 90,
    left: card1X,
    width: 420,
    height: 520,
    transform: `rotate(-6deg) scale(${cardScale})`,
    zIndex: 3,
  }}
>
  <WhiteCard src={img2?.path} />
</div>

  {/* ---------- Card 2 ---------- */}

<div
  style={{
    position: "absolute",
    top: 420,
    left: card2X,
    width: 420,
    height: 520,
    transform: `rotate(4deg) scale(${cardScale})`,
    zIndex: 4,
  }}
>
  <WhiteCard src={img3?.path} />
</div>

  {/* ---------- Card 3 ---------- */}

<div
  style={{
    position: "absolute",
    top: 760,
    left: card3X,
    width: 420,
    height: 520,
    transform: `rotate(-3deg) scale(${cardScale})`,
    zIndex: 5,
  }}
>
  <WhiteCard src={img4?.path} />
</div>

</AbsoluteFill>
      </Sequence>

      {/* ===================================== */}
      {/* SCENE 3 - MAGAZINE */}
      {/* ===================================== */}

      <Sequence
        from={scene1Duration + scene2Duration}
        durationInFrames={scene3Duration}
      >
<AbsoluteFill>

  {/* Background */}
  <ImageView src={img5?.path} />

  {/* ================= BIG CARD ================= */}

  <div
    style={{
      position: "absolute",
      top: bigCardY,
      left: 40,
      width: 1000,
      height: 1020,
      transform: `scale(${magazineScale})`,
    }}
  >
    <WhiteCard src={img5?.path} />
  </div>

  {/* Divider */}

  <div
    style={{
      position: "absolute",
      top: 1090,
      left: 40,
      width: 1000,
      height: 4,
      background: "#ffffff",
      opacity: dividerOpacity,
    }}
  />

  {/* ================= SMALL CARD ================= */}

  <div
    style={{
      position: "absolute",
      top: 1120 + smallCardY,
      left: 40,
      width: 420,
      height: 360,
      transform: "rotate(-3deg)",
    }}
  >
    <WhiteCard src={img6?.path} />
  </div>

  {/* ================= TEXT ================= */}

  <div
    style={{
      position: "absolute",
      top: 1180,
      left: 520,
      color: "#fff",
    }}
  >
    <div
      style={{
        fontSize: 54,
        fontWeight: 800,
        letterSpacing: 6,
      }}
    >
      WEDDING
    </div>

    <div
      style={{
        marginTop: 15,
        fontSize: 24,
        color: "#dddddd",
        letterSpacing: 3,
      }}
    >
      Every Picture Tells A Story
    </div>
  </div>

</AbsoluteFill>
      </Sequence>

      {/* ===================================== */}
      {/* SCENE 4 - FLOATING MOSAIC */}
      {/* ===================================== */}

      <Sequence
        from={
          scene1Duration +
          scene2Duration +
          scene3Duration
        }
        durationInFrames={scene4Duration}
      >
<AbsoluteFill>

  {/* Blur Background */}
  <ImageView src={img7?.path} />

  {/* Card 1 */}
  <div
    style={{
      position: "absolute",
      top: card7Y,
      left: 330,
      width: 420,
      height: 460,
      transform: `rotate(-5deg) scale(${mosaicScale})`,
      zIndex: 4,
    }}
  >
    <WhiteCard src={img7?.path} />
  </div>

  {/* Card 2 */}
  <div
    style={{
      position: "absolute",
      top: 620,
      left: card8X,
      width: 360,
      height: 420,
      transform: "rotate(4deg)",
      zIndex: 2,
    }}
  >
    <WhiteCard src={img8?.path} />
  </div>

  {/* Card 3 */}
  <div
    style={{
      position: "absolute",
      top: 620,
      left: card9X,
      width: 360,
      height: 420,
      transform: "rotate(-4deg)",
      zIndex: 2,
    }}
  >
    <WhiteCard src={img9?.path} />
  </div>

  {/* Card 4 */}
  <div
    style={{
      position: "absolute",
      top: card10Y,
      left: 330,
      width: 420,
      height: 460,
      transform: "rotate(2deg)",
      zIndex: 5,
    }}
  >
    <WhiteCard src={img10?.path} />
  </div>

</AbsoluteFill>
      </Sequence>

      {/* ===================================== */}
      {/* SCENE 5 - POLAROID */}
      {/* ===================================== */}

      <Sequence
        from={
          scene1Duration +
          scene2Duration +
          scene3Duration +
          scene4Duration
        }
        durationInFrames={scene5Duration}
      >
        <AbsoluteFill>

  {/* Background */}
  <ImageView src={img11?.path} />

  {/* Shadow */}

  <div
    style={{
      position: "absolute",
      bottom: 260,
      left: "50%",
      width: 420,
      height: 40,
      borderRadius: "50%",
      background: "#000",
      opacity: shadowOpacity,
      filter: "blur(18px)",
      transform: "translateX(-50%)",
    }}
  />

  {/* Polaroid */}

  <div
    style={{
      position: "absolute",
      top: scene5Frame < 25 ? polaroidY : polaroidBounce,
      left: 290,
      width: 500,
      height: 700,

      background: "#fff",

      padding: 18,

      borderRadius: 12,

      transform: `rotate(${polaroidRotate}deg)`,

      boxShadow: "0 30px 70px rgba(0,0,0,.35)",
    }}
  >
    <Img
      src={img11?.path ?? ""}
      style={{
        width: "100%",
        height: 560,
        objectFit: "contain",
      }}
    />

    <div
      style={{
        marginTop: 20,
        textAlign: "center",
        fontSize: 28,
        fontWeight: 600,
        color: "#444",
        letterSpacing: 2,
      }}
    >
      Forever ❤️
    </div>
  </div>

</AbsoluteFill>

      </Sequence>

      {/* ===================================== */}
      {/* SCENE 6 - HERO ENDING */}
      {/* ===================================== */}

      <Sequence
        from={
          scene1Duration +
          scene2Duration +
          scene3Duration +
          scene4Duration +
          scene5Duration
        }
        durationInFrames={scene6Duration}
      >
<AbsoluteFill>

  {/* Blur Background */}

  <Img
    src={img12?.path ?? ""}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "blur(35px) brightness(.4)",
      transform: "scale(1.2)",
    }}
  />

  {/* Hero Image */}

  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Img
      src={img12?.path ?? ""}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        transform: `scale(${endingScale})`,
      }}
    />
  </AbsoluteFill>

  {/* Vignette */}

  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `rgba(0,0,0,${vignetteOpacity})`,
    }}
  />

  {/* Main Title */}

  <div
    style={{
      position: "absolute",
      bottom: 230,
      width: "100%",
      textAlign: "center",
      color: "#ffffff",
      fontSize: 72,
      fontWeight: 800,
      letterSpacing: 8,
      opacity: endingOpacity,
      transform: `translateY(${textY}px)`,
      textShadow: "0 10px 30px rgba(0,0,0,.5)",
    }}
  >
    FOREVER BEGINS
  </div>

  {/* Subtitle */}

  <div
    style={{
      position: "absolute",
      bottom: 160,
      width: "100%",
      textAlign: "center",
      color: "#e5e5e5",
      fontSize: 24,
      letterSpacing: 4,
      opacity: endingOpacity,
      transform: `translateY(${textY}px)`,
    }}
  >
    A Beautiful Journey Starts Here
  </div>

</AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};