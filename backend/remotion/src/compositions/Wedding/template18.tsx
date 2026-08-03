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


interface MemoryJourneyWeddingReelProps {
  images?: ImageItem[];
  namesText?: string;
}



// =====================================
// FLOATING CARD
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



const translateX = interpolate(
progress,
[0,1],
[startPositions[index].x,0]
);


const translateY = interpolate(
progress,
[0,1],
[startPositions[index].y,0]
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
// SCENE 1 : FLOATING MEMORY WALL
// 0 - 3 SEC
// =====================================


const FloatingMemoryWall = ({
 images=[]
}:{
 images:ImageItem[]
})=>{
const cardsPosition = [

{
  left:20,
  top:180,
  width:330,
  height:450
},

{
  left:375,
  top:80,
  width:330,
  height:430
},

{
  left:730,
  top:180,
  width:330,
  height:450
},

{
  left:180,
  top:600,
  width:330,
  height:450
},

{
  left:560,
  top:560,
  width:330,
  height:430
},

{
  left:20,
  top:1050,
  width:330,
  height:450
},

{
  left:375,
  top:980,
  width:330,
  height:430
},

{
  left:730,
  top:1050,
  width:330,
  height:450
}

];


// =====================================
// SCENE 2 : FILM STRIP TRANSITION
// 3 - 8 SEC
// =====================================




return (

<AbsoluteFill

style={{

background:"#f8f5f0"

}}

>


{
images.slice(0,8).map((img,index)=>(

<FloatingCard

key={index}

image={img}

index={index}

position={cardsPosition[index]}

/>

))

}



</AbsoluteFill>

)

};
const FilmStrip = ({
  images=[]
}:{
  images:ImageItem[]
})=>{


const frame = useCurrentFrame();


// horizontal movement
const translateX = interpolate(
  frame,
  [0,150],
  [300,-1200],
  {
    extrapolateRight:"clamp"
  }
);



return (

<AbsoluteFill

style={{

background:"#f8f5f0",

justifyContent:"center",

overflow:"hidden"

}}

>
<div

style={{

position:"absolute",

top:100,

width:"100%",

textAlign:"center",

zIndex:10,

color:"#3a2b22",

}}

>

<div

style={{

fontSize:30,

letterSpacing:10,

fontFamily:"serif",

opacity:0.7

}}

>

OUR JOURNEY

</div>

</div>

<div

style={{

display:"flex",

gap:40,

alignItems:"center",

transform:
`translateX(${translateX}px)`

}}

>


{
images.slice(8,13).map((img,index)=>(


<FilmCard

key={index}

image={img}

index={index}

/>


))

}



</div>


</AbsoluteFill>

)

};



// =================================
// FILM CARD WITH ZOOM
// =================================

const FilmCard = ({
 image,
 index
}:{
 image:ImageItem;
 index:number;
})=>{


const frame = useCurrentFrame();


const zoom = interpolate(

frame,

[0,150],

[1,1.15],

{
 extrapolateRight:"clamp"
}

);



const opacity = interpolate(

frame,

[0,20],

[0,1],

{
 extrapolateRight:"clamp"
}

);



return (

<div

style={{

width:800,

height:1300,

borderRadius:45,

overflow:"hidden",

flexShrink:0,

position:"relative",

opacity,


boxShadow:
"0 40px 100px rgba(0,0,0,0.6)"

}}

>


<Img

src={image.path}

style={{

width:"100%",

height:"100%",

objectFit:"cover",

transform:
`scale(${zoom})`

}}

/>



<div

style={{

position:"absolute",

inset:0,

background:
"linear-gradient(to top,rgba(0,0,0,.45),transparent 60%)"

}}

/>


</div>

)

};




// =====================================
// SCENE 3 : CINEMATIC HERO PHOTOS
// 8 - 17 SEC
// =====================================

const HeroPhoto = ({
  image
}:{
  image:ImageItem
})=>{


const frame = useCurrentFrame();


const scale = interpolate(
  frame,
  [0,90],
  [1.15,1],
  {
    extrapolateRight:"clamp"
  }
);


// circle reveal
const circleSize = interpolate(
  frame,
  [0,25],
  [0,150],
  {
    extrapolateRight:"clamp"
  }
);



const opacity = interpolate(
  frame,
  [0,20],
  [0,1],
  {
    extrapolateRight:"clamp"
  }
);



return (

<AbsoluteFill

style={{

background:"#000",

overflow:"hidden"

}}

>


<Img

src={image.path}

style={{

width:"100%",

height:"100%",

objectFit:"cover",

transform:`scale(${scale})`,

opacity,


clipPath:
`circle(${circleSize}% at 50% 50%)`

}}

/>



{/* cinematic overlay */}


<AbsoluteFill
style={{
background:
"radial-gradient(circle,transparent 30%,rgba(255,255,255,0.15))"
}}
/>

</AbsoluteFill>

)

};

const HeroSequence = ({
images=[]
}:{
images:ImageItem[]
})=>{


const duration = 90; // 3 sec each photo


return (

<AbsoluteFill>

{

images.slice(15,18).map((img,index)=>(


<Sequence

key={index}

from={index*duration}

durationInFrames={duration}

>


<HeroPhoto

image={img}

/>


</Sequence>


))

}


</AbsoluteFill>

)

};
// =====================================
// SCENE 4 : FINAL HERO ENDING
// 17 - 22 SEC
// =====================================

// MAIN COMPOSITION
// =====================================


export const MemoryJourneyWeddingReel = ({
images=[],
namesText="JULIAN & JULI"

}:MemoryJourneyWeddingReelProps)=>{


return (

<AbsoluteFill>


{/* SCENE 1 */}
<Sequence

from={0}

durationInFrames={90}

>

<FloatingMemoryWall

images={images}

/>

</Sequence>

{/* SCENE 2 */}
<Sequence

from={90}

durationInFrames={150}

>

<FilmStrip

images={images}

/>

</Sequence>
{/* SCENE 3 */}

<Sequence

from={240}

durationInFrames={270}

>

<HeroSequence

images={images}

/>

</Sequence>

</AbsoluteFill>

)

};