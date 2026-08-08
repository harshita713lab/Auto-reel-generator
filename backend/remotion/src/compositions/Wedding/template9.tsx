import React from "react";

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";

import {
  AnimatedImage,
} from "../../components";


interface ImageItem {
  path:string;
}


interface CinematicWeddingReelProps {

  images?: ImageItem[];

  music?:{
    path:string;
    volume?:number;
  };

}




const CinematicWeddingReel:
React.FC<CinematicWeddingReelProps>
=({

images=[],
music

})=>{



// =============================
// IMAGE DISTRIBUTION
// =============================


  const safeImages = images.length > 0 ? images : [{ path: "" }];
  const getImg = (idx: number) => safeImages[idx % safeImages.length];

  const heroImage = getImg(0);
  const bottomGridImages = [getImg(1), getImg(2), getImg(3)];
  const singleImages = [getImg(4), getImg(5), getImg(6), getImg(7)];
  const endingImage = getImg(8);




// =============================
// TIMING (30 FPS)
// =============================


const heroDuration = 60;
// 2 sec


const gridDuration = 180;
// 3 sec


const singleDuration = 150;
// 5 sec


const endingDuration = 60;
// 2 sec



const totalDuration =
heroDuration +
gridDuration +
singleDuration +
endingDuration;



// =============================
// FULL SCREEN HERO
// =============================


const FullScreenHero = ({
image,
title,
animation="zoomIn"

}:{

image?:ImageItem;

title?:string;

animation?:string;

})=>{


if(!image)
return null;



return(

<AbsoluteFill>


<AnimatedImage

src={image.path}

animation={animation}

durationInFrames={60}

style={{

width:"100%",
height:"100%",
objectFit:"cover"

}}

/>



{
title &&

<div

style={{

position:"absolute",

bottom:180,

width:"100%",

textAlign:"center",

color:"#fff",

fontSize:80,

fontWeight:900,

letterSpacing:12,

textShadow:
"0 5px 25px rgba(0,0,0,.8)"

}}

>

{title}

</div>

}



</AbsoluteFill>

)

}




// =============================
// HERO + BOTTOM GRID

// =============================
// HERO + BOTTOM 3 GRID
// =============================


const HeroBottomGrid = ()=>{


return(

<AbsoluteFill>


{/* =================
    MAIN HERO IMAGE
================= */}


<div

style={{

position:"absolute",

top:0,

height:"75%",

width:"100%"

}}

>


{
heroImage &&

<AnimatedImage

src={heroImage.path}

animation="zoomIn"

durationInFrames={90}

style={{

width:"100%",

height:"100%",

objectFit:"cover"

}}

/>

}


</div>





{/* =================
    BOTTOM 3 IMAGES
================= */}


<div

style={{

position:"absolute",

bottom:0,

height:"25%",

width:"100%",

display:"flex",

gap:8,

padding:8,

background:"#000"

}}

>


{

bottomGridImages.map((img,index)=>{


const frame = useCurrentFrame();



const y = interpolate(

frame,

[
index*10,
index*10+20
],

[
200,
0
],

{

extrapolateLeft:"clamp",

extrapolateRight:"clamp"

}

);



const opacity = interpolate(

frame,

[
index*10,
index*10+20
],

[
0,
1
],

{

extrapolateLeft:"clamp",

extrapolateRight:"clamp"

}

);




return(

<div

key={index}

style={{

width:"33.33%",

height:"100%",

transform:
`translateY(${y}px)`,

opacity

}}

>


<img

src={img.path}

style={{

width:"100%",

height:"100%",

objectFit:"cover",

borderRadius:12

}}

/>



</div>

)


})

}


</div>



</AbsoluteFill>

)

}






// =============================

// =============================
// SINGLE CINEMATIC PHOTO
// =============================

const SinglePhoto = ({
  image,
  index,
}: {
  image: ImageItem;
  index: number;
}) => {
  const frame = useCurrentFrame();

  // Each photo now has a full 35-frame window to animate cleanly
  const scale = interpolate(
    frame,
    [0, 35],
    [1.12, 1.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateX = interpolate(
    frame,
    [0, 35],
    [index % 2 === 0 ? -40 : 40, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    frame,
    [0, 35],
    [index % 2 === 0 ? 20 : -20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const rotate = interpolate(
    frame,
    [0, 35],
    [index % 2 === 0 ? -1 : 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Quick fade-in
  const opacity = interpolate(
    frame,
    [0, 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Smooth blur clear-up
  const blur = interpolate(
    frame,
    [0, 15],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const brightness = interpolate(
    frame,
    [0, 15],
    [0.7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <img
        src={image.path}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
          filter: `blur(${blur}px) brightness(${brightness})`,
          opacity,
        }}
      />
      {/* Cinematic dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,.35), transparent 40%)",
        }}
      />
    </AbsoluteFill>
  );
};
// PART 2 ME COMPLETE HOGA
// =============================


return(

<AbsoluteFill
style={{
background:"#000"
}}
>


{/* =============================
    SCENE 1
    FULL SCREEN HERO
    0 - 2 sec
============================= */}


<Sequence

from={0}

durationInFrames={heroDuration}

>


<FullScreenHero

image={heroImage}

title="FOREVER"

animation="zoomIn"

/>


</Sequence>






{/* =============================
    SCENE 2
    HERO + BOTTOM 3 GRID
    2 - 5 sec
============================= */}


<Sequence

from={heroDuration}

durationInFrames={gridDuration}

>


<HeroBottomGrid/>


</Sequence>






{/* =============================
    SCENE 3
    SINGLE CINEMATIC PHOTOS
    5 - 10 sec
============================= */}


{/* =============================
    SCENE 3
    SINGLE CINEMATIC PHOTOS
============================= */}
<Sequence from={heroDuration + gridDuration} durationInFrames={singleDuration}>
  {singleImages.map((img, index) => (
    <Sequence
      key={index}
      from={index * 37.5} 
      durationInFrames={37.5}
    >
      <SinglePhoto image={img} index={index} />
    </Sequence>
  ))}
</Sequence>







{/* =============================
    SCENE 4
    ENDING HERO
    10 - 12 sec
============================= */}



<Sequence

from={
heroDuration +
gridDuration +
singleDuration
}

durationInFrames={endingDuration}

>


<FullScreenHero

image={endingImage}

title="THE END"

animation="zoomOut"

/>



</Sequence>






{/* =============================
        MUSIC
============================= */}


</AbsoluteFill>

)






}


export default CinematicWeddingReel;