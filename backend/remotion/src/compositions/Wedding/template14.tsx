
import React from "react";

import {
  AbsoluteFill,
  Img,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";


interface ImageItem {
  path:string;
}
interface RoyalWeddingStoryProps {
  images?: ImageItem[];
  music?: {
    path: string;
    volume?: number;
  };
}

export const RoyalWeddingStory : React.FC<RoyalWeddingStoryProps> = ({
  images = [],
  music,
}) => {

  // ==========================
  // IMAGE DISTRIBUTION (17 IMAGES)
  // ==========================

  const heroImg = images[0];

  const gridImgs = images.slice(1, 5);

  const splitImgs = images.slice(5, 9);



  const masonryImgs = images.slice(9,16);



  // ==========================
  // 15 SECOND TIMELINE
  // ==========================

  const heroDuration = 60;
  const gridDuration = 60;
  const splitDuration = 60;
  
  const masonryDuration = 120;
 
  const endingDuration = 45;

  const totalDuration =
    heroDuration +
    gridDuration +
    splitDuration +

    masonryDuration +
    endingDuration;
// =====================================
// HERO IMAGE
// =====================================

const HeroImage = ({
  image,
}: {
  image?: { path: string };
}) => {

  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 60],
    [1.15, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const opacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#000",
      }}
    >
      <Img
        src={image?.path ?? ""}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          opacity,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,.55), transparent 60%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 140,
          width: "100%",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 10,
            fontFamily: "serif",
          }}
        >
          WEDDING FILM
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: 6,
          }}
        >
          FOREVER
        </div>
      </div>
    </AbsoluteFill>
  );
};



// =====================================
// DYNAMIC GRID
// =====================================

const DynamicGrid = ({
  images,
}: {
  images: { path: string }[];
}) => {

  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        padding: 8,
        background: "#111",
      }}
    >
      {images.map((img, index) => {

        const delay = index * 6;

        const scale = interpolate(
          frame - delay,
          [0, 18],
          [0.6, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={index}
            style={{
              overflow: "hidden",
              borderRadius: 20,
              transform: `scale(${scale})`,
              boxShadow: "0 10px 25px rgba(0,0,0,.45)",
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
          </div>
        );
      })}
    </AbsoluteFill>
  );
};



// =====================================
// SPLIT SCREEN
// =====================================
const SplitScreen = ({
  images,
}: {
  images: { path: string }[];
}) => {

  const frame = useCurrentFrame();

const positions = [
  { left: 40, top: 80 },     // 1 Left
  { left: 500, top: 420 },   // 2 Right
  { left: 40, top: 760 },    // 3 Left
  { left: 500, top: 1100 },  // 4 Right
  
];

return (
  <AbsoluteFill
    style={{
      background: "#faf8f5",
      position: "relative",
    }}
  >
    {images.map((img, index) => {
  const start = index * 8;

  if (frame < start) return null;

  const startX =
    index % 2 === 0 ? -500 : 500;
const opacity = interpolate(
  frame,
  [index * 8, index * 8 + 5],
  [0, 1],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }
);
  const translateX = interpolate(
    frame,
    [start, start + 20],
    [startX, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(
    frame,
    [start, start + 20],
    [1.15, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      key={index}
      style={{
        position: "absolute",
        left: positions[index].left,
        top: positions[index].top,
        width: 520,
        height: 500,
        overflow: "hidden",
        borderRadius: 28,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        boxShadow: "0 12px 30px rgba(0,0,0,.45)",
      }}
    >
      <Img
        src={img.path}
        style={{
          position: "absolute",
    inset: 0,

          width: "100%",
          height: "100%",
          objectFit: "cover",
              objectPosition: "center 20%",

          transform: "scale(1.02)",
        }}
      />
    </div>
  );
})}
  </AbsoluteFill>
);
};






// =====================================
// PREMIUM MASONRY
// =====================================

const MasonryGrid = ({ images }: { images: { path: string }[] }) => {
  return (
    <AbsoluteFill
   style={{
  padding: 20,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gridTemplateRows: "1fr 1.3fr 1fr",
  gap: 12,
  background: "#faf8f5",
  height: "100%",
}}
    >
      {images.map((img, i) => {
        let gridStyle = {};
switch (i) {
  case 0:
    gridStyle = {
      gridColumn: "1 / span 2",
      gridRow: "1",
    };
    break;

  case 1:
    gridStyle = {
      gridColumn: "3 / span 2",
      gridRow: "1",
    };
    break;

  case 2:
    gridStyle = {
      gridColumn: "1",
      gridRow: "2",
    };
    break;

  case 3:
    gridStyle = {
      gridColumn: "4",
      gridRow: "2",
    };
    break;

  case 4:
    gridStyle = {
      gridColumn: "1 / span 1",
      gridRow: "3",
    };
    break;

  case 5:
    gridStyle = {
      gridColumn: "2 / span 2",
      gridRow: "3",
    };
    break;

  case 6:
    gridStyle = {
      gridColumn: "4",
      gridRow: "3",
    };
    break;
}

        return (
          <div
            key={i}
            style={{
              ...gridStyle,
              overflow: "hidden",
              borderRadius: 22,
              position: "relative",
            }}
          >
            <Img
              src={img.path}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        );
      })}

      {/* Center Text */}
      <div
        style={{
          gridColumn: "2 / span 2",
          gridRow: "2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            color: "#4b3a2f",
            fontFamily: "Playfair Display",
            lineHeight: 1.2,
          }}
        >
          Forever
          <br />
          Starts Here
        </div>

        <div
          style={{
            width: 90,
            height: 2,
            background: "#b08d57",
            marginTop: 18,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// =====================================
// DUAL CARD FLIP
// =====================================




// =====================================
// ENDING SCENE
// =====================================

const EndingScene = () => {

  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0,20],
    [0,1]
  );

  return (

    <AbsoluteFill
      style={{
        background:"#000",
        justifyContent:"center",
        alignItems:"center"
      }}
    >

      <div
        style={{
          textAlign:"center",
          color:"#fff",
          opacity
        }}
      >

        <div
          style={{
            fontSize:34,
            letterSpacing:8,
            fontFamily:"serif"
          }}
        >
          THANK YOU
        </div>

        <div
          style={{
            marginTop:15,
            fontSize:60,
            fontWeight:700
          }}
        >
          Forever Begins
        </div>

      </div>

    </AbsoluteFill>

  );

};









  return (
    <AbsoluteFill style={{ background: "#000" }}>

      {/* HERO */}
      <Sequence
        from={0}
        durationInFrames={heroDuration}
      >
        <HeroImage image={heroImg} />
      </Sequence>

      {/* GRID */}
      <Sequence
        from={heroDuration}
        durationInFrames={gridDuration}
      >
        <DynamicGrid images={gridImgs} />
      </Sequence>

      {/* SPLIT */}
      <Sequence
        from={heroDuration + gridDuration}
        durationInFrames={splitDuration}
      >
        <SplitScreen images={splitImgs} />
      </Sequence>

      {/* COLLAGE */}
     

      {/* MASONRY */}
      <Sequence
        from={
          heroDuration +
          gridDuration +
          splitDuration 
          
        }
        durationInFrames={masonryDuration}
      >
        <MasonryGrid images={masonryImgs} />
      </Sequence>

      {/* CARD FLIP */}
   

      {/* ENDING */}
      <Sequence
        from={
          heroDuration +
          gridDuration +
          splitDuration +
        
          masonryDuration 
        }
        durationInFrames={endingDuration}
      >
        <EndingScene />
      </Sequence>

      {music?.path && (
        <audio
          src={music.path}
          autoPlay
        />
      )}

    </AbsoluteFill>
  );
};