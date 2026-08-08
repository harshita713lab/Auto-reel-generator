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


// =====================================
// TYPES
// =====================================

interface ImageItem {
  path: string;
}

interface Template26Props {
  images?: ImageItem[];
}


// =====================================
// SCENE 1 CARD
// =====================================

const FloatingCard = ({
  image,
  index,
  position
}:{
  image:ImageItem;
  index:number;
  position:any;
})=>{


const frame = useCurrentFrame();
const {fps}=useVideoConfig();


// har image ka alag delay
const delay = index * 10;


const progress = spring({

frame: frame - delay,

fps,

config:{
 damping:14,
 stiffness:90,
 mass:0.8
}

});


const startPositions = [

{ x:-300, y:0 },
{ x:0, y:-300 },
{ x:300, y:0 },
{ x:-300, y:300 },
{ x:300, y:300 },
{ x:-350, y:200 },
{ x:0, y:400 },
{ x:350, y:200 }

];



const pos = startPositions[index % startPositions.length];

const translateX = interpolate(
progress,
[0,1],
[pos.x,0]
);


const translateY = interpolate(
progress,
[0,1],
[pos.y,0]
);



const rotate = interpolate(
progress,
[0,1],
[
index%2===0 ? -20 : 20,
0
]
);



const scale = interpolate(
progress,
[0,1],
[
0.4,
1
]
);



const opacity = interpolate(
progress,
[0,1],
[0,1]
);



return (

<div

style={{

position:"absolute",

left:position.left,

top:position.top,

width:position.width,

height:position.height,
border:"8px solid black",

opacity,


transform:

`
translate(${translateX}px,${translateY}px)
scale(${scale})
rotate(${rotate}deg)
`,

borderRadius:24,

overflow:"hidden",

boxShadow:
"0 25px 60px rgba(0,0,0,.5)"

}}

>


<Img

src={image.path}

style={{

width:"100%",

height:"100%",

objectFit:"cover"

}}

/>


</div>

)

};


// =====================================
// SCENE 1
// =====================================

const Scene1 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {

  const frame = useCurrentFrame();


  const positions = [

    {
      left: 20,
      top: 180,
      width: 330,
      height: 450,
    },

    {
      left: 375,
      top: 80,
      width: 330,
      height: 430,
    },

    {
      left: 730,
      top: 180,
      width: 330,
      height: 450,
    },

    {
      left: 180,
      top: 600,
      width: 330,
      height: 450,
    },

    {
      left: 560,
      top: 560,
      width: 330,
      height: 430,
    },

    {
      left: 20,
      top: 1050,
      width: 330,
      height: 450,
    },

    {
      left: 375,
      top: 980,
      width: 330,
      height: 430,
    },

    {
      left: 730,
      top: 1050,
      width: 330,
      height: 450,
    },

  ];


  return (
    <AbsoluteFill
      style={{
        background: "#f8f5f0",
      }}
    >

      {/* 8 IMAGES */}

      {images.slice(0, 8).map((img, index) => (

        <FloatingCard
          key={index}
          image={img}
          index={index}
          position={positions[index]}
        />

      ))}


      {/* TEXT */}

      {frame > 100 && (

        <div
          style={{
            position: "absolute",

            left: 0,
            right: 0,

            bottom: 200,

            textAlign: "center",

            fontSize: 80,

            fontFamily: "cursive",

            color: "#3a2b22",

            fontWeight: 600,

            opacity: interpolate(
              frame,
              [100, 130],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            ),

            transform: `
              translateY(
                ${interpolate(
                  frame,
                  [100, 130],
                  [50, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }
                )}px
              )
            `,
          }}
        >
          I Love You ❤️
        </div>

      )}

    </AbsoluteFill>
  );
};


// =====================================
// SCENE 2 CARD
// =====================================
const Scene2Card = ({
  image,
  index,
}: {
  image: ImageItem;
  index: number;
}) => {

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - index * 15,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
      mass: 0.8,
    },
  });

  const rotate = interpolate(
    progress,
    [0, 1],
    [
      index % 2 === 0 ? -15 : 15,
      index % 2 === 0 ? -3 : 3,
    ]
  );

  const cardScale = interpolate(
    progress,
    [0, 1],
    [0.7, 1]
  );

  const y = interpolate(
    progress,
    [0, 1],
    [300, 0]
  );

  const opacity = interpolate(
    progress,
    [0, 1],
    [0, 1]
  );

  return (
    <div
      style={{
        position: "absolute",

        left: "50%",
        top: "50%",

        width: 800,
        height: 1400,

        transform: `
          translate(-50%, -50%)
          translateY(${y}px)
          rotate(${rotate}deg)
          scale(${cardScale})
        `,

        opacity,

        background: "#fff",

        padding: 25,

        boxSizing: "border-box",

        borderRadius: 8,

        boxShadow:
          "0 30px 80px rgba(0,0,0,0.45)",

        overflow: "hidden",
      }}
    >

      {/* IMAGE AREA */}
      <div
        style={{
          width: "100%",
          height: "100%",

          overflow: "hidden",

          position: "relative",

          background: "#fff",
        }}
      >

        <Img
          src={image.path}
          style={{
            position: "absolute",

            left: "50%",
            top: "50%",

            width: "100%",
            height: "100%",

            objectFit: "cover",
            objectPosition: "center",

            display: "block",

            transform:
              "translate(-50%, -50%) scale(1.8)",
          }}
        />

      </div>

    </div>
  );
};



// =====================================
// SCENE 2
// Images 9-14
// =====================================

const Scene2 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {

  const frame = useCurrentFrame();


  return (
    <AbsoluteFill
      style={{
        background: "rgba(0,0,0,0.20)",
        overflow: "hidden",
      }}
    >

      {/* BACKGROUND IMAGE */}

      <Img
        src={images[8]?.path}
        style={{
          position: "absolute",

          width: "100%",
          height: "100%",

          objectFit: "cover",

          filter: "grayscale(100%) brightness(0.9) contrast(1.05)",

          transform: `
            scale(
              ${interpolate(
                frame,
                [0, 90],
                [1, 1.15],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )}
            )
          `,
        }}
      />


      {/* DARK OVERLAY */}

      <AbsoluteFill
        style={{
          background:
            "rgba(0,0,0,0.35)",
        }}
      />


      {/* 6 STACKED CARDS */}

      {images.slice(8, 14).map(
        (img, index) => (

          <Scene2Card
            key={index}
            image={img}
            index={index}
          />

        )
      )}

    </AbsoluteFill>
  );
};


// =====================================
// SCENE 3 CARD
// =====================================
const Scene3Card = ({
  image,
  index,
  offsetY,
}: {
  image: ImageItem;
  index: number;
  offsetY: number;
}) => {

  const leftSide = index % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",

        left: leftSide ? 45 : 555,

        top: index * 520 + offsetY,

        width: 480,
        height: 560,

        background: "#f7f4ed",

        padding: 18,

        boxSizing: "border-box",

        boxShadow:
          "0 18px 35px rgba(0,0,0,0.28)",

        transform:
          `rotate(${leftSide ? -0.5 : 0.5}deg)`,

        overflow: "hidden",
      }}
    >

      {/* IMAGE WRAPPER */}
      <div
        style={{
          width: "100%",
          height: 524,

          overflow: "hidden",

          position: "relative",

          background: "#f7f4ed",
        }}
      >

        <Img
          src={image.path}
          style={{
            position: "absolute",

            left: "50%",
            top: "50%",

            width: "100%",
            height: "100%",

            objectFit: "cover",
            objectPosition: "center",

            display: "block",

            transform:
              "translate(-50%, -50%) scale(1.5)",
          }}
        />

      </div>

    </div>
  );
};



// =====================================
// SCENE 3
// Images 15-18
// Moving Upward
// =====================================

const Scene3 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {

  const frame = useCurrentFrame();


  // Cards move upward
  const offsetY = -frame * 4;


  return (
    <AbsoluteFill
      style={{
        background: "#14294a",

        overflow: "hidden",
      }}
    >

      {/* ONLY IMAGE 15-18 */}

      {images.slice(14, 18).map(
        (img, index) => (

          <Scene3Card
            key={index}
            image={img}
            index={index}
            offsetY={offsetY}
          />

        )
      )}

    </AbsoluteFill>
  );
};


// =====================================
// MAIN TEMPLATE 26
// =====================================

export const Template26 = ({
  images = [],
}: Template26Props) => {

  return (
    <>

      {/* =================================
          SCENE 1
          0s - 6s
      ================================= */}

      <Sequence
        from={0}
        durationInFrames={180}
      >

        <Scene1
          images={images}
        />

      </Sequence>


      {/* =================================
          1 SECOND GAP
          6s - 7s
      ================================= */}


      {/* =================================
          SCENE 2
          7s - 10s
      ================================= */}

      <Sequence
        from={180}
        durationInFrames={120}
      >

        <Scene2
          images={images}
        />

      </Sequence>


      {/* =================================
          SCENE 3
          10s - 14s
      ================================= */}

      <Sequence
        from={300}
        durationInFrames={120}
      >

        <Scene3
          images={images}
        />

      </Sequence>

    </>
  );
};