import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface ImageItem {
  path: string;
}

interface Props {
  images?: ImageItem[];


}

export const ScrapbookWedding15 = ({
  images=[],

}: Props) => {

  const { fps } = useVideoConfig();

  if (!images || images.length < 15) {
    return (
      <AbsoluteFill
        style={{
          background: "#f7f2ea",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 45,
            fontFamily: "Georgia",
            color: "#444",
          }}
        >
          Minimum 15 Images Required
        </div>
      </AbsoluteFill>
    );
  }

  /*====================================================

                PAPER BACKGROUND

=====================================================*/

  const PaperBackground = () => {

    return (
      <AbsoluteFill
        style={{
          background: "#F7F2EA",
          overflow: "hidden",
        }}
      >

        {/* Paper Texture */}

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: .18,
            background:
              `
              radial-gradient(circle,#00000008 1px,transparent 1px)
              `,
            backgroundSize: "18px 18px",
          }}
        />

      </AbsoluteFill>
    );

  };



  /*====================================================

                INTRO SCENE

=====================================================*/

const IntroScene = ({
  image,
}: {
  image: ImageItem;
}) => {
  const frame = useCurrentFrame();

  /* ---------------- TEXT ---------------- */

  const textOpacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const textY = interpolate(
    frame,
    [0, 20],
    [-40, 0],
    {
      extrapolateRight: "clamp",
    }
  );

  /* ---------------- CARD ---------------- */

  const cardY = interpolate(
    frame,
    [18, 50],
    [220, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const cardScale = interpolate(
    frame,
    [18, 50],
    [0.88, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const rotate = interpolate(
    frame,
    [18, 50],
    [-4, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const imageScale = interpolate(
    frame,
    [18, 70],
    [1.15, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill>

      <PaperBackground />

      {/* ---------------- TITLE ---------------- */}

      <div
        style={{
          position: "absolute",
          top: 90,
          width: "100%",
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontFamily: "Georgia",
            color: "#B8860B",
            letterSpacing: 3,
            fontWeight: 600,
          }}
        >
          Our Beautiful Story
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            color: "#8B7500",
            letterSpacing: 10,
          }}
        >
          SCRAPBOOK MEMORIES
        </div>
      </div>

      {/* ---------------- PHOTO CARD ---------------- */}

      <div
        style={{
          position: "absolute",
          width: 760,
          height: 1080,
          left: "50%",
          top: 300,

          transform: `
            translateX(-50%)
            translateY(${cardY}px)
            scale(${cardScale})
            rotate(${rotate}deg)
          `,

          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 35px 70px rgba(0,0,0,.22)",
        }}
      >
        <Img
          src={image.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${imageScale})`,
          }}
        />
      </div>

      {/* ---------------- TOP TAPE ---------------- */}

      <div
        style={{
          position: "absolute",
          top: 270 + cardY,
          left: "50%",
          width: 180,
          height: 45,
          background: "rgba(255,245,190,.75)",
          transform: "translateX(-50%) rotate(-3deg)",
          borderRadius: 4,
          zIndex: 15,
        }}
      />

      {/* ---------------- BOTTOM TAPE ---------------- */}

      <div
        style={{
          position: "absolute",
          top: 1280 + cardY,
          left: "58%",
          width: 150,
          height: 40,
          background: "rgba(255,245,190,.7)",
          transform: "rotate(8deg)",
          borderRadius: 4,
          zIndex: 15,
        }}
      />

      {/* ---------------- SHADOW ---------------- */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(transparent 60%, rgba(0,0,0,.25))",
          pointerEvents: "none",
        }}
      />

    </AbsoluteFill>
  );
};

/*====================================================

              HEART SCRAPBOOK COLLAGE

=====================================================*/

const HeartCollage = ({
  images,
}: {
  images: ImageItem[];
}) => {

  const frame = useCurrentFrame();

  const zoom = interpolate(
    frame,
    [0, 150],
    [0.92, 1],
    {
      extrapolateRight: "clamp",
    }
  );
const textOpacity = interpolate(
  frame,
  [110, 140],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);

const textY = interpolate(
  frame,
  [110, 140],
  [30, 0],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);
const positions = [
  // Top Hero
  { left: 360, top: 40, rotate: -5 },

  // Second Row
  { left: 120, top: 210, rotate: -8 },
  { left: 600, top: 210, rotate: 8 },

  // Third Row
  { left: 220, top: 430, rotate: -6 },
  { left: 500, top: 430, rotate: 5 },

  // Fourth Row
  { left: 120, top: 650, rotate: -8 },
  { left: 600, top: 650, rotate: 8 },

  // Bottom Hero
  { left: 360, top: 840, rotate: -3 },
];

  return (

    <AbsoluteFill>

      <PaperBackground />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom})`,
        }}
      >

        {images.map((img, index) => {

          const start = index * 12;

          const scale = interpolate(
            frame,
            [start, start + 20],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const opacity = interpolate(
            frame,
            [start, start + 18],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const p = positions[index];

          return (

            <div
              key={index}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: 260,
                height: 320,

                background: "#fff",

                padding: 14,

                borderRadius: 10,

                opacity,

                transform: `
                rotate(${p.rotate}deg)
                scale(${scale})
              `,

                boxShadow:
                  "0 20px 45px rgba(0,0,0,.18)",
              }}
            >

              <Img
                src={img.path}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Masking Tape */}

              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  width: 80,
                  height: 26,
                  background:
                    "rgba(255,245,180,.7)",
                  transform:
                    "translateX(-50%) rotate(-5deg)",
                }}
              />

            </div>

          );

        })}

      </div>
      <div
  style={{
    position: "absolute",
    bottom: 350,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    opacity: textOpacity,
    transform: `translateY(${textY}px)`,
  }}
>
  <div
    style={{
      fontFamily: "Cormorant Garamond",
      fontSize: 60,
      fontWeight: "600",
      color: "#1d0a0a",
      letterSpacing: 2,
    }}
  >
    Collecting Moments
  </div>

  <div
    style={{
      width: 120,
      height: 2,
      background: "#C8A96A",
      marginTop: 14,
      marginBottom: 14,
      borderRadius: 2,
    }}
  />

  <div
    style={{
      fontFamily: "Cormorant Garamond",
      fontSize: 40,
      color: "#624f39",
      letterSpacing: 6,
      textTransform: "uppercase",
    }}
  >
    Creating Memories
  </div>
</div>

    </AbsoluteFill>

  );

};
/*====================================================

            VERTICAL MEMORY STRIP

=====================================================*/

const MemoryStrip = ({
  images,
}: {
  images: ImageItem[];
}) => {

  const frame = useCurrentFrame();

  const stripY = interpolate(
    frame,
    [0, 120],
    [220, -420],
    {
      extrapolateRight: "clamp",
    }
  );

  const zoom = interpolate(
    frame,
    [0, 70],
    [1.08, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill>

      <PaperBackground />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 120,
          width: 420,
          
          transform: `
          translateX(-50%)
          translateY(${stripY}px)
          scale(${zoom})
          `,
        }}
      >

        {images.map((img, index) => {

          const start = index * 18;

          const opacity = interpolate(
            frame,
            [start, start + 20],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const rotate = index % 2 === 0 ? -3 : 3;

          return (

            <div
              key={index}
              style={{
                position: "relative",
                marginBottom: 35,
                background: "#fff",
                padding: 14,
                borderRadius: 8,
                opacity,
                transform: `rotate(${rotate}deg)`,
                boxShadow:
                  "0 15px 40px rgba(0,0,0,.18)",
              }}
            >

              <Img
                src={img.path}
                style={{
                  width: "100%",
                  height: 320,
                  objectFit: "cover",
                }}
              />

              {/* Tape */}

              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  width: 90,
                  height: 24,
                  background:
                    "rgba(255,245,185,.75)",
                  transform:
                    "translateX(-50%) rotate(-4deg)",
                }}
              />

            </div>

          );

        })}

      </div>

    </AbsoluteFill>
  );
};
/*====================================================

            FLOATING MEMORY BOARD

=====================================================*/


/*====================================================

                FINAL HERO

=====================================================*/

const EndingHero = ({
  image,
}: {
  image: ImageItem;
}) => {

  const frame = useCurrentFrame();

  const zoom = interpolate(
    frame,
    [0, 90],
    [1.15, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const opacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const bars = interpolate(
    frame,
    [45, 90],
    [0, 14],
    {
      extrapolateRight: "clamp",
    }
  );

  return (

    <AbsoluteFill>

      <Img
        src={image.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.55))",
        }}
      />

      {/* Top Bar */}

      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: `${bars}%`,
          background: "#000",
        }}
      />

      {/* Bottom Bar */}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: `${bars}%`,
          background: "#000",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 170,
          width: "100%",
          textAlign: "center",
          opacity,
        }}
      >

        <div
          style={{
            fontSize: 70,
            color: "#fff",
            fontFamily: "Georgia",
            letterSpacing: 5,
          }}
        >
          Forever Together
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 32,
            color: "#f2d8a2",
            letterSpacing: 10,
          }}
        >
          OUR MEMORIES
        </div>

      </div>

    </AbsoluteFill>

  );

};
  return (

    <AbsoluteFill>
<Sequence
from={0}
durationInFrames={70}
>
<IntroScene
image={images[0]}
/>
</Sequence>

<Sequence
from={70}
durationInFrames={150}
>
<HeartCollage
images={[
images[1],
images[2],
images[3],
images[4],
images[5],
images[6],
images[7],
images[8],
]}
/>
</Sequence>
<Sequence
  from={220}
  durationInFrames={150}
>
  <MemoryStrip
    images={[
      images[9],
      images[10],
      images[11],
      images[12],
      images[13],
    ]}
  />
</Sequence>

<Sequence
from={370}
durationInFrames={100}
>
<EndingHero
image={images[14]}
/>
</Sequence>

    </AbsoluteFill>

  );

};