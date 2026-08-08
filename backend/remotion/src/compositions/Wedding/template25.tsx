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



// ======================================================
// INTERFACES
// ======================================================

interface ImageItem {
  path: string;
}

interface WeddingTemplate14Props {
  images?: ImageItem[];

  music?: {
    path: string;
    volume?: number;
  };
}

// ======================================================
// COMPONENT
// ======================================================


  // ======================================================
  // HOOKS
  // ======================================================
const Scene1: React.FC<{
  images: ImageItem[];
}> = ({ images }) => {

  const frame = useCurrentFrame();


  const { fps, width, height } = useVideoConfig();

  // ======================================================
  // SCENE DURATIONS
  // ======================================================


  // SCENE 1 ANIMATIONS
  // ======================================================
  const img1Opacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const img1Y = interpolate(
    frame,
    [0, 20],
    [-60, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );


  // -----------------------------
  // IMAGE 2 (Bottom Left)
  // 8-14 frames
  // -----------------------------
  const img2Opacity = interpolate(
    frame,
    [50,70],
    [0,1],
    {
      extrapolateLeft:"clamp",
      extrapolateRight:"clamp",
    }
  );

  const img2X = interpolate(
    frame,
    [50,70],
    [-80,0],
    {
      extrapolateLeft:"clamp",
      extrapolateRight:"clamp",
    }
  );


  // -----------------------------
  // IMAGE 3 (Bottom Right)
  // 15-21 frames
  // -----------------------------
  const img3Opacity = interpolate(
    frame,
    [100,120],
    [0,1],
    {
      extrapolateLeft:"clamp",
      extrapolateRight:"clamp",
    }
  );

  const img3X = interpolate(
    frame,
    [100,120],
    [80,0],
    {
      extrapolateLeft:"clamp",
      extrapolateRight:"clamp",
    }
  );


  // -----------------------------
  // IMAGE 4 (Bottom Full)
  // 22-28 frames
  // -----------------------------
  const img4Opacity = interpolate(
    frame,
    [150,170],
    [0,1],
    {
      extrapolateLeft:"clamp",
      extrapolateRight:"clamp",
    }
  );

  const img4Y = interpolate(
    frame,
    [150,170],
    [80,0],
    {
      extrapolateLeft:"clamp",
      extrapolateRight:"clamp",
    }
  );

const darkEffect = interpolate(
  frame,
  [180,190,205],
  [0,1,0],
  {
    extrapolateLeft:"clamp",
    extrapolateRight:"clamp",
  }
);
  // ======================================================
  // SCENE 2 ANIMATIONS
  // ======================================================

  // ======================================================
  // SCENE 11 ANIMATIONS
  // ======================================================

   return (
    <AbsoluteFill
      style={{
        backgroundColor:"#fff",
        padding:18,
      }}
    >

      <div
        style={{
          width:"100%",
          height:"100%",
          display:"flex",
          flexDirection:"column",
          gap:18,
           filter:
 `
 brightness(${1 - darkEffect * 0.75})
 grayscale(${darkEffect})
 `

        }}
      >

        {/* IMAGE 1 */}
        <div
          style={{
            flex:1.3,
            overflow:"hidden",
            borderRadius:12,
            opacity:img1Opacity,
            transform:`translateY(${img1Y}px)`
          }}
        >
          <Img
            src={images[0].path}
            style={{
              width:"100%",
              height:"100%",
              objectFit:"cover",
            }}
          />
        </div>


        {/* IMAGE 2 + IMAGE 3 */}
        <div
          style={{
            flex:0.8,
            display:"flex",
            gap:18,
          }}
        >

          {/* IMAGE 2 */}
          <div
            style={{
              flex:1,
              overflow:"hidden",
              borderRadius:12,
              opacity:img2Opacity,
              transform:`translateX(${img2X}px)`
            }}
          >
            <Img
              src={images[1].path}
              style={{
                width:"100%",
                height:"100%",
                objectFit:"cover",
              }}
            />
          </div>


          {/* IMAGE 3 */}
          <div
            style={{
              flex:1,
              overflow:"hidden",
              borderRadius:12,
              opacity:img3Opacity,
              transform:`translateX(${img3X}px)`
            }}
          >
            <Img
              src={images[2].path}
              style={{
                width:"100%",
                height:"100%",
                objectFit:"cover",
              }}
            />
          </div>

        </div>



        {/* IMAGE 4 */}
        <div
          style={{
            flex:1,
            overflow:"hidden",
            borderRadius:12,
            opacity:img4Opacity,
            transform:`translateY(${img4Y}px)`
          }}
        >

          <Img
            src={images[3].path}
            style={{
              width:"100%",
              height:"100%",
              objectFit:"cover",
            }}
          />

        </div>


      </div>


   


    </AbsoluteFill>
  );
};
const Scene2: React.FC<{
images: ImageItem[];
}> = ({images}) => {

const frame = useCurrentFrame();

const imageDuration = 68;


// stripe movement

const leftMove = interpolate(
frame,
[
0,
30,
60,
90,
120,
150,
180,
210
],
[
0,
-120,
0,
-120,
0,
-120,
0,
-120
],
{
extrapolateLeft:"clamp",
extrapolateRight:"clamp"
}
);


const rightMove = interpolate(
frame,
[
0,
30,
60,
90,
120,
150,
180,
210
],
[
0,
120,
0,
120,
0,
120,
0,
120
],
{
extrapolateLeft:"clamp",
extrapolateRight:"clamp"
}
);


return (

<AbsoluteFill
style={{
background:"#050505",
alignItems:"center",
justifyContent:"center",
overflow:"hidden",
}}
>


{/* LEFT COLOR FILM STRIP */}

<div
style={{
position:"absolute",
left:0,
top:0,
width:75,
height:"200%",

background:
`
linear-gradient(
180deg,
#e6c85c,
#9bb56a,
#e6c85c
)
`,

transform:`translateY(${leftMove}px)`
}}
>

<div
style={{
width:"100%",
height:"100%",

background:
`
repeating-linear-gradient(
180deg,
transparent 0px,
transparent 25px,
rgba(0,0,0,.7) 25px,
rgba(0,0,0,.7) 42px
)
`
}}
/>

</div>



{/* RIGHT COLOR FILM STRIP */}

<div
style={{
position:"absolute",
right:0,
top:0,
width:75,
height:"200%",

background:
`
linear-gradient(
180deg,
#4bb6c7,
#78d6d1,
#4bb6c7
)
`,

transform:`translateY(${rightMove}px)`
}}
>

<div
style={{
width:"100%",
height:"100%",

background:
`
repeating-linear-gradient(
180deg,
transparent 0px,
transparent 25px,
rgba(0,0,0,.7) 25px,
rgba(0,0,0,.7) 42px
)
`
}}
/>

</div>



{/* CENTER IMAGES */}

{
images.slice(0,4).map((img,index)=>{

const start=index*imageDuration;


const opacity=interpolate(
frame,
[
start,
start+8,
start+imageDuration-8,
start+imageDuration
],
[
0,
1,
1,
0
],
{
extrapolateRight:"clamp"
}
);



const scale=interpolate(
frame,
[
start,
start+imageDuration
],
[
1,
1.12
],
{
extrapolateRight:"clamp"
}
);



return (

<div
key={index}
style={{
position:"absolute",

width:"86%",
height:"60%",

overflow:"hidden",

borderRadius:8,

opacity,

boxShadow:
"0 0 40px rgba(0,0,0,.8)"
}}
>


<Img
src={img.path}

style={{
width:"100%",
height:"100%",
objectFit:"cover",

transform:
`scale(${scale})`
}}

/>


</div>

)

})

}



</AbsoluteFill>

)

};
const Scene3: React.FC<{
images: ImageItem[];
}> = ({ images }) => {

const frame = useCurrentFrame();

const imageDuration = 68; // 4 images total ~9 sec

return (

<AbsoluteFill
style={{
backgroundColor:"#000",
alignItems:"center",
justifyContent:"center",
}}
>

{
images.slice(0,4).map((img,index)=>{

const start = index * imageDuration;

const opacity = interpolate(
frame,
[
start,
start+8,
start+imageDuration-8,
start+imageDuration
],
[
0,
1,
1,
0
],
{
extrapolateLeft:"clamp",
extrapolateRight:"clamp"
}
);


const scale = interpolate(
frame,
[
start,
start+imageDuration
],
[
1.12,
1
],
{
extrapolateLeft:"clamp",
extrapolateRight:"clamp"
}
);


return (

<AbsoluteFill
key={index}
style={{
opacity,
alignItems:"center",
justifyContent:"center",
}}
>

{/* IMAGE */}
<div
style={{
width:"100%",
height:"85%",
overflow:"hidden",
position:"relative",
}}
>

<Img
src={img.path}
style={{
width:"100%",
height:"100%",
objectFit:"cover",
transform:`scale(${scale})`,
}}
/>


{/* HEART CENTER BOTTOM */}
<div
style={{
position:"absolute",
bottom:80,
left:"50%",
transform:"translateX(-50%)",
fontSize:100,
filter:"drop-shadow(0 0 10px rgba(255,0,100,0.7))"
}}
>
💞
</div>


</div>


</AbsoluteFill>

)

})

}


</AbsoluteFill>

);

};
export const WeddingTemplate14= ({
  images = [],
  music,
}: WeddingTemplate14Props) => {
  return (

<AbsoluteFill>


  <Sequence
    from={0}
    durationInFrames={210}
  >

    <Scene1
      images={images.slice(0,4)}
    />

  </Sequence>
<Sequence
 from={210}
 durationInFrames={270}
>
 <Scene2
   images={images.slice(4,8)}
 />
</Sequence>
<Sequence
 from={510}
 durationInFrames={210}
>

<Scene3
 images={images.slice(8,13)}
/>

</Sequence>
</AbsoluteFill>

);
};
export const Template25 = WeddingTemplate14;

