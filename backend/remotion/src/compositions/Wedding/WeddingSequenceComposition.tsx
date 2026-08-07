import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

import {
  AnimatedImage
} from "../../components";
import { PremiumGrid } from "./PreiumGrid";


interface WeddingSequenceCompositionProps {
  images?: Array<{
    path: string;
    duration?: number;
    animation?: string;
    transition?: string;
  }>;

  music?: {
    path: string;
    volume?: number;
  };
}

const WeddingSequenceComposition: React.FC<
  WeddingSequenceCompositionProps
> = ({
  images = [],
  music,
}) => {

  const frame = useCurrentFrame();

  const { fps } = useVideoConfig();

  // Scene Durations

  const rowDuration = 120;

  const fastDuration = 90;
  const CardDuration = 120;
  const gridDuration = 120;

  const totalDuration =
    rowDuration +
    fastDuration +
    CardDuration +
    gridDuration;

  const safeImages = images.length > 0 ? images : [{ path: "" }];
  const getImg = (idx: number) => safeImages[idx % safeImages.length];

  const img1 = getImg(0);
  const img2 = getImg(1);
  const img3 = getImg(2);

  const img4 = getImg(3);
  const img5 = getImg(4);
  const img6 = getImg(5);
  const img7 = getImg(6);
  const img8 = getImg(7);

  const img9 = getImg(8);
  const img10 = getImg(9);
  const img11 = getImg(10);

  const img12 = getImg(11);
  const img13 = getImg(12);
  const img14 = getImg(13);
  const img15 = getImg(14);
  const img16 = getImg(15);

  const gridImages = [
    getImg(16),
    getImg(17),
    getImg(18),
    getImg(19),
  ];

  // -----------------------------------
  // Row Image
  // -----------------------------------

  const RowImage = ({
    image,
  }: {
    image?: {
      path: string;
      animation?: string;
    };
  }) => {

    if (!image) return null;

    return (
      <AnimatedImage
        src={image.path}
        animation={image.animation ?? "slideUp"}
        durationInFrames={20}
        style={{
          width: "100%",
          height: "32%",
          objectFit: "cover",
          borderRadius: 18,
        }}
      />
    );
  };
// -----------------------------------
// Rotating Card Image
// -----------------------------------

const CardImage = ({
  image,
delay = 0,
}: {
  image?: {
    path: string;
  };
  delay?: number;
}) => {

  const frame = useCurrentFrame();

  if (!image) return null;



const rotate = interpolate(frame -delay,[0,20],[-180,0],{
  extrapolateLeft:"clamp",
  extrapolateRight:"clamp",
});

const scale = interpolate(frame-delay,[0,20],[0.4,1],{
  extrapolateLeft:"clamp",
  extrapolateRight:"clamp",
});

const opacity = interpolate(frame-delay,[0,15],[0,1],{
  extrapolateLeft:"clamp",
  extrapolateRight:"clamp",
});

  return (
    <div
      style={{
        width:300,
        height:220,
        background:"#fff",
        padding:12,
        borderRadius:18,
        boxShadow:"0 15px 40px rgba(0,0,0,.5)",
    transform:
`rotate(${rotate + 5}deg) scale(${scale})`,
        opacity,
      }}
    >

      <img
        src={image.path}
        style={{
          width:"100%",
          height:"100%",
          objectFit:"cover",
          borderRadius:12,
        }}
      />

    </div>
  );
};


  // -----------------------------------
  // Fast Image
  // -----------------------------------

  const FlashImage = ({
    image,
  }: {
    image?: {
      path: string;
      animation?: string;
    };
  }) => {

    if (!image) return null;

    return (
      <AnimatedImage
        src={image.path}
        animation={image.animation ?? "zoomIn"}
        durationInFrames={9}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
   

    );
  };

  return (

    <AbsoluteFill
      style={{
        background: "#000",
      }}
    >
            {/* ===========================
          Sequence 1 : Row Reveal
      ============================ */}
<Sequence from={0} durationInFrames={rowDuration}>
  <AbsoluteFill>

    {/* Row 1 */}
    <Sequence from={0} durationInFrames={90}>
      <div
        style={{
          position: "absolute",
          top: "0%",
          left: 0,
        width: "100%",
          height: "80%",
        }}
      >
        <RowImage image={img1} />
       <div
  style={{
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    color: "#fff",
    fontSize: 72,
    fontWeight: 900,
    letterSpacing: 12,
    textTransform: "uppercase",
    textShadow:
      "0 0 10px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.4), 0 8px 25px rgba(0,0,0,.9)",
  }}
>
  Camera
</div>
      </div>
    </Sequence>

    {/* Row 2 */}
    <Sequence from={30} durationInFrames={60}>
      <div
         style={{
          position: "absolute",
          top: "34%",
          left: 0,
        width: "100%",
          height: "80%",
        }}
      >
        <RowImage image={img2} />
       <div
  style={{
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    color: "#fff",
    fontSize: 72,
    fontWeight: 900,
    letterSpacing: 12,
    textTransform: "uppercase",
    textShadow:
      "0 0 10px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.4), 0 8px 25px rgba(0,0,0,.9)",
  }}
>
  Rolling
</div>
      </div>
    </Sequence>

    {/* Row 3 */}
    <Sequence from={60} durationInFrames={30}>
      <div
     style={{
          position: "absolute",
          top: "68%",
          left: 0,
        width: "100%",
          height: "80%",
        }}
      >
        <RowImage image={img3} />
       <div
  style={{
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    color: "#fff",
    fontSize: 72,
    fontWeight: 900,
    letterSpacing: 12,
    textTransform: "uppercase",
    textShadow:
      "0 0 10px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.4), 0 8px 25px rgba(0,0,0,.9)",
  }}
>
  Action
</div>
      </div>
    </Sequence>

  </AbsoluteFill>
</Sequence>

      {/* ===========================
          Sequence 2 : Fast Images
      ============================ */}
{/* ===========================
    Sequence : Fast Fullscreen Images
=========================== */}

<Sequence
  from={rowDuration}
  durationInFrames={fastDuration}
>
  <AbsoluteFill>

    {[img4, img5, img6, img7, img8,img16].map((img, index) => (
      <Sequence
        key={index}
        from={index * 9}
        durationInFrames={9}
      >
        <AnimatedImage
          src={img?.path ?? ""}
          animation="zoomIn"
          durationInFrames={9}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Sequence>
    ))}

  </AbsoluteFill>
</Sequence>
      
      



  {/* ===========================
    Sequence 3 : Rotating Cards
=========================== */}

<Sequence
  from={rowDuration + fastDuration }
  durationInFrames={CardDuration}
>
  <AbsoluteFill>

    <Sequence from={0} durationInFrames={30}>
      <div
        style={{
          position:"absolute",
          left:80,
          top:100,
        }}
      >
        <CardImage image={img9} delay={0}/>
      </div>
    </Sequence>


    <Sequence from={8} durationInFrames={30}>
      <div
        style={{
          position:"absolute",
          right:80,
          top:150,
        }}
      >
        <CardImage image={img10} delay={8}/>
      </div>
    </Sequence>


    <Sequence from={16} durationInFrames={30}>
      <div
        style={{
          position:"absolute",
          left:150,
          top:450,
        }}
      >
        <CardImage image={img11} delay={16}/>
      </div>
    </Sequence>


    <Sequence from={24} durationInFrames={30}>
      <div
        style={{
          position:"absolute",
          right:150,
          top:500,
        }}
      >
        <CardImage image={img12} delay={24}/>
      </div>
    </Sequence>


    <Sequence from={32} durationInFrames={30}>
      <div
        style={{
          position:"absolute",
          left:400,
          top:250,
        }}
      >
        <CardImage image={img13} delay={32}/>
      </div>
    </Sequence>


    <Sequence from={40} durationInFrames={30}>
      <div
        style={{
          position:"absolute",
          right:400,
          bottom:100,
        }}
      >
        <CardImage image={img14} delay={40}/>
      </div>
    </Sequence>
 <Sequence from={40} durationInFrames={30}>
      <div
        style={{
          position:"absolute",
          right:400,
          bottom:100,
        }}
      >
        <CardImage image={img15} delay={40}/>
      </div>
    </Sequence>

  </AbsoluteFill>
</Sequence>

      {/* ===========================
          Sequence 4 : Fast Images
      ============================ */}

      
            {/* ===========================
          Sequence 5 : Premium Grid
      ============================ */}

      <Sequence
        from={rowDuration + fastDuration + CardDuration}
        durationInFrames={gridDuration}
      >
        <PremiumGrid
          images={gridImages}
          slideDuration={gridDuration / fps}
          music={undefined}
          transition="glide"
          effect="cinematic"
          showCounter={true}
        />
      </Sequence>

      {/* ===========================
          Music
      ============================ */}

     
    </AbsoluteFill>
  );
};

export default WeddingSequenceComposition;