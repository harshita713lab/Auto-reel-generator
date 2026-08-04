import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";

interface ReelProps {
  images?: { path: string }[];
  music?: {
    path: string;
    volume?: number;
  };
}

export const Reel: React.FC<ReelProps> = ({
  images = [],
  music,
}) => {

  const frame = useCurrentFrame();

  // 9 Images
  const hero1 = images[0];

  const splitImgs = images.slice(1,3);

  const hero2 = images[3];

  const layoutImgs = images.slice(4,7);

  const endingImgs = images.slice(7,9);

  // Duration
  const heroDuration = 45;

  const textDuration = 30;

  const splitDuration = 70;

  const hero2Duration = 60;

  const layoutDuration = 80;

  const endingDuration = 60;

  const totalDuration =
    heroDuration +
    textDuration +
    splitDuration +
    hero2Duration +
    layoutDuration +
    endingDuration;


    const FinalSplit = ({
  images,
}: {
  images: { path: string }[];
}) => {
  const frame = useCurrentFrame();

  const leftScale = interpolate(
    frame,
    [0, 25],
    [1.2, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const rightScale = interpolate(
    frame,
    [0, 25],
    [1.2, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        background: "#000",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Img
          src={images[0]?.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${leftScale})`,
          }}
        />
      </div>

      <div
        style={{
          width: 6,
          background: "#fff",
        }}
      />

      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Img
          src={images[1]?.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${rightScale})`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: "100%",
          textAlign: "center",
          color: "#fff",
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: 5,
        }}
      >
        FOREVER ❤️
      </div>
    </AbsoluteFill>
  );
};
const FloatingGallery = ({
  images,
}: {
  images: { path: string }[];
}) => {
  const frame = useCurrentFrame();

  const centerScale = interpolate(
    frame,
    [0, 25],
    [0.85, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const leftX = interpolate(
    frame,
    [0, 25],
    [-250, 0],
    {
      extrapolateRight: "clamp",
    }
  );

  const rightX = interpolate(
    frame,
    [0, 25],
    [250, 0],
    {
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        background: "#f8f6f3",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Left Card */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 340,
          width: 280,
          height: 430,
          borderRadius: 22,
          overflow: "hidden",
          transform: `translateX(${leftX}px) rotate(-8deg)`,
          boxShadow: "0 15px 40px rgba(0,0,0,.25)",
        }}
      >
        <Img
          src={images[0]?.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Center Image */}
      <div
        style={{
          width: 520,
          height: 760,
          borderRadius: 28,
          overflow: "hidden",
          transform: `scale(${centerScale})`,
          boxShadow: "0 25px 60px rgba(0,0,0,.35)",
          zIndex: 5,
        }}
      >
        <Img
          src={images[1]?.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Right Card */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 340,
          width: 280,
          height: 430,
          borderRadius: 22,
          overflow: "hidden",
          transform: `translateX(${rightX}px) rotate(8deg)`,
          boxShadow: "0 15px 40px rgba(0,0,0,.25)",
        }}
      >
        <Img
          src={images[2]?.path}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Bottom Text */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          width: "100%",
          textAlign: "center",
          color: "#4b3a2f",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          Every Frame Tells A Story
        </div>
      </div>
    </AbsoluteFill>
  );
};



const HeroSceneTwo = ({
  image,
}: {
  image?: { path: string };
}) => {

  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 45],
    [1.2, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const opacity = interpolate(
    frame,
    [0, 12],
    [0, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const textY = interpolate(
    frame,
    [10, 30],
    [40, 0],
    {
      extrapolateLeft: "clamp",
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
            "linear-gradient(to top, rgba(0,0,0,.65), transparent 60%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 140,
          width: "100%",
          textAlign: "center",
          color: "#fff",
          transform: `translateY(${textY}px)`,
          opacity,
        }}
      >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 8,
              color: "#e6d3a3",
            }}
          >
            CAPTURED WITH LOVE
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            Forever Together
          </div>
      </div>

    </AbsoluteFill>
  );
};
    const SplitScene = ({
  images,
}: {
  images: { path: string }[];
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "#faf8f5",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {images.map((img, index) => {
        const start = index * 10;

        const x = interpolate(
          frame,
          [start, start + 20],
          [index === 0 ? -600 : 600, 0],
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

        const opacity = interpolate(
          frame,
          [start, start + 10],
          [0, 1],
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

              left: index === 0 ? 50 : 560,
              top: 260,

              width: 470,
              height: 900,

              overflow: "hidden",

              borderRadius: 30,

              opacity,

              transform: `translateX(${x}px) scale(${scale})`,

              boxShadow: "0 18px 40px rgba(0,0,0,.35)",
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
  const TextScene = ({
  title,
  subtitle,
}:{
  title:string;
  subtitle:string;
})=>{

  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0,8,18,20],
    [0,1,1,0],
    {
      extrapolateRight:"clamp"
    }
  );

  const translateY = interpolate(
    frame,
    [0,15],
    [70,0],
    {
      extrapolateRight:"clamp"
    }
  );

  return(

    <AbsoluteFill
      style={{
        background:"#000",
        justifyContent:"center",
        alignItems:"center",
      }}
    >

      <div
        style={{
          textAlign:"center",
          opacity,
          transform:`translateY(${translateY}px)`,
        }}
      >

        <div
          style={{
            color:"#fff",
            fontSize:70,
            fontWeight:700,
            letterSpacing:10,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop:15,
            color:"#c9b37e",
            fontSize:24,
            letterSpacing:6,
          }}
        >
          {subtitle}
        </div>

      </div>

    </AbsoluteFill>

  );

};

const HeroImage = ({
  image,
}: {
  image?: { path: string };
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 45],
    [1.18, 1],
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
            "linear-gradient(to top, rgba(0,0,0,.55), transparent 65%)",
        }}
      />
    </AbsoluteFill>
  );
};
return (
  <AbsoluteFill style={{ background: "#000" }}>

    <Sequence from={0} durationInFrames={heroDuration}>
      <HeroImage image={hero1} />
    </Sequence>

    <Sequence
      from={heroDuration}
      durationInFrames={textDuration}
    >
      <TextScene
        title="MEMORIES"
        subtitle="Captured Forever"
      />
    </Sequence>

    <Sequence
      from={heroDuration + textDuration}
      durationInFrames={splitDuration}
    >
      <SplitScene images={splitImgs} />
    </Sequence>

    <Sequence
      from={heroDuration + textDuration + splitDuration}
      durationInFrames={hero2Duration}
    >
      <HeroSceneTwo image={hero2} />
    </Sequence>

    <Sequence
      from={
        heroDuration +
        textDuration +
        splitDuration +
        hero2Duration
      }
      durationInFrames={layoutDuration}
    >
      <FloatingGallery images={layoutImgs} />
    </Sequence>

    <Sequence
      from={
        heroDuration +
        textDuration +
        splitDuration +
        hero2Duration +
        layoutDuration
      }
      durationInFrames={endingDuration}
    >
      <FinalSplit images={endingImgs} />
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

export default Reel;