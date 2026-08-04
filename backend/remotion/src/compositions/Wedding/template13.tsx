import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";


interface Cinematic13Props {
  images?: {
    path: string;
  }[];
}

export const Cinematic13Composition = ({
  images = []
}:Cinematic13Props)=>{
const ClosingScene = ({
 left,
 right
}:{
 left:string;
 right:string;
})=>{


const frame = useCurrentFrame();



const leftX = interpolate(
 frame,
 [0,35],
 [-100,0],
 {
  extrapolateRight:"clamp"
 }
);


const rightX = interpolate(
 frame,
 [0,35],
 [100,0],
 {
  extrapolateRight:"clamp"
 }
);



const bar = interpolate(
 frame,
 [35,60],
 [0,18],
 {
  extrapolateRight:"clamp"
 }
);



const textOpacity = interpolate(
 frame,
 [45,60],
 [0,1],
 {
  extrapolateRight:"clamp"
 }
);



return(

<AbsoluteFill
style={{
background:"#000",
overflow:"hidden"
}}
>


{/* LEFT IMAGE */}

<div
style={{
position:"absolute",
left:0,
width:"50%",
height:"100%",
transform:
`translateX(${leftX}%)`
}}
>

<Img
src={left}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

</div>



{/* RIGHT IMAGE */}

<div
style={{
position:"absolute",
right:0,
width:"50%",
height:"100%",
transform:
`translateX(${rightX}%)`
}}
>

<Img
src={right}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

</div>



{/* TOP BAR */}

<div
style={{

position:"absolute",

top:0,
left:0,

width:"100%",
height:`${bar}%`,

background:"#000"

}}
/>



{/* BOTTOM BAR */}

<div
style={{

position:"absolute",

bottom:0,
left:0,

width:"100%",
height:`${bar}%`,

background:"#000"

}}
/>



{/* END TEXT */}

<div
style={{

position:"absolute",

top:"50%",
left:0,

width:"100%",

textAlign:"center",

transform:"translateY(-50%)",

opacity:textOpacity,

fontFamily:"serif",

fontSize:75,

letterSpacing:8,

color:"#fff"

}}
>
The End
</div>



</AbsoluteFill>

)

}

const EndText = ({
 title="Forever Begins"
}:{
 title?:string
})=>{


const frame = useCurrentFrame();


const opacity = interpolate(
 frame,
 [0,20],
 [0,1],
 {
  extrapolateRight:"clamp"
 }
);


const y = interpolate(
 frame,
 [0,35],
 [50,0],
 {
  extrapolateRight:"clamp"
 }
);



return(

<AbsoluteFill
style={{

background:"#fff",

justifyContent:"center",

alignItems:"center"

}}
>


<div
style={{

opacity,

transform:
`translateY(${y}px)`,

fontFamily:"serif",

fontSize:80,

letterSpacing:6,

color:"#111"

}}
>

{title}

</div>


</AbsoluteFill>

)

}

const FilmStrip = ({
  images
}:{
  images:{
    path:string
  }[]
})=>{


const frame = useCurrentFrame();



return(

<AbsoluteFill
style={{
background:"#111",
justifyContent:"center",
alignItems:"center"
}}
>


<div
style={{

width:850,
height:1100,

display:"grid",

gridTemplateColumns:"1fr 1fr",

gap:25,

padding:40,

background:"#050505",

border:
"8px solid #222",

boxShadow:
"0 0 60px rgba(0,0,0,.8)"

}}
>


{
images.map((img,index)=>{


const start = index*10;


const scale = interpolate(
 frame,
 [start,start+20],
 [0,1],
 {
  extrapolateLeft:"clamp",
  extrapolateRight:"clamp"
 }
);


const rotate = interpolate(
 frame,
 [start,start+20],
 [
 index%2===0 ? -8:8,
 0
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

overflow:"hidden",

background:"#000",

transform:
`
scale(${scale})
rotate(${rotate}deg)
`

}}
>


<Img
src={img.path}
style={{

width:"100%",
height:"100%",

objectFit:"cover"

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


const HeroScene = ({
 image
}:{
 image:string
})=>{


const frame = useCurrentFrame();



const scale = interpolate(
 frame,
 [0,55],
 [1.05,1.18],
 {
  extrapolateRight:"clamp"
 }
);



const x = interpolate(
 frame,
 [0,55],
 [0,-25],
 {
  extrapolateRight:"clamp"
 }
);



const textOpacity = interpolate(
 frame,
 [25,50],
 [0,1],
 {
  extrapolateRight:"clamp"
 }
);



const textY = interpolate(
 frame,
 [25,55],
 [40,0],
 {
  extrapolateRight:"clamp"
 }
);



return (

<AbsoluteFill>


{/* HERO IMAGE */}

<Img
src={image}
style={{
width:"100%",
height:"100%",
objectFit:"cover",

transform:
`
scale(${scale})
translateX(${x}px)
`
}}
/>



{/* DARK GRADIENT */}

<div
style={{

position:"absolute",
inset:0,

background:
"linear-gradient(transparent 55%,rgba(0,0,0,.8))"

}}
/>



{/* TEXT */}

<div
style={{

position:"absolute",

bottom:120,

width:"100%",

textAlign:"center",

opacity:textOpacity,

transform:
`translateY(${textY}px)`

}}
>

<div
style={{

fontFamily:"serif",

fontSize:65,

letterSpacing:5,

color:"#fff"

}}
>
Captured Forever
</div>


</div>


</AbsoluteFill>

)

}



const FloatingGallery = ({
  images
}:{
  images:{
    path:string
  }[]
})=>{


const frame = useCurrentFrame();


const float = Math.sin(frame/15)*15;


const centerScale = interpolate(
  frame,
  [0,30],
  [0.8,1],
  {
    extrapolateRight:"clamp"
  }
);


const sideScale = interpolate(
  frame,
  [0,25],
  [0.6,1],
  {
    extrapolateRight:"clamp"
  }
);



return(

<AbsoluteFill
style={{
background:"#000",
justifyContent:"center",
alignItems:"center"
}}
>


{/* CENTER IMAGE */}

<Img
src={images[1].path}
style={{

position:"absolute",

width:620,
height:850,

objectFit:"cover",

transform:
`scale(${centerScale})
translateY(${float/2}px)`,

borderRadius:20,

boxShadow:
"0 30px 80px rgba(0,0,0,.7)"

}}
/>



{/* LEFT IMAGE */}

<Img
src={images[0].path}
style={{

position:"absolute",

left:80,
top:430,

width:350,
height:500,

objectFit:"cover",

transform:
`
rotate(-12deg)
scale(${sideScale})
translateY(${float}px)
`,

borderRadius:20

}}
/>



{/* RIGHT IMAGE */}

<Img
src={images[2].path}
style={{

position:"absolute",

right:80,
top:430,

width:350,
height:500,

objectFit:"cover",

transform:
`
rotate(12deg)
scale(${sideScale})
translateY(${-float}px)
`,

borderRadius:20

}}
/>


</AbsoluteFill>

)

}

const TextScene = ({
  title="Every Love",
  subtitle="Has A Story"
}:{
  title?:string;
  subtitle?:string;
})=>{


const frame = useCurrentFrame();


const opacity = interpolate(
  frame,
  [0,20],
  [0,1],
  {
    extrapolateRight:"clamp"
  }
);


const translateY = interpolate(
  frame,
  [0,30],
  [40,0],
  {
    extrapolateRight:"clamp"
  }
);



return(

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
opacity,
transform:
`translateY(${translateY}px)`
}}
>


<div
style={{
fontSize:70,
fontFamily:"serif",
letterSpacing:4,
color:"white",
fontWeight:300
}}
>
{title}
</div>



<div
style={{
fontSize:65,
fontFamily:"serif",
letterSpacing:6,
color:"#e8c98b",
marginTop:15
}}
>
{subtitle}
</div>


</div>


</AbsoluteFill>

)

}



const SplitScene = ({
  left,
  right,
}:{
  left:string;
  right:string;
})=>{

const frame = useCurrentFrame();


const leftX = interpolate(
  frame,
  [0,35],
  [-100,0],
  {
    extrapolateRight:"clamp"
  }
);


const rightX = interpolate(
  frame,
  [0,35],
  [100,0],
  {
    extrapolateRight:"clamp"
  }
);


const line = interpolate(
  frame,
  [15,40],
  [0,1],
  {
    extrapolateRight:"clamp"
  }
);



return (

<AbsoluteFill
style={{
display:"flex",
flexDirection:"row",
overflow:"hidden"
}}
>


{/* LEFT IMAGE */}

<div
style={{
width:"50%",
height:"100%",
transform:
`translateX(${leftX}%)`
}}
>

<Img
src={left}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

</div>



{/* RIGHT IMAGE */}

<div
style={{
width:"50%",
height:"100%",
transform:
`translateX(${rightX}%)`
}}
>

<Img
src={right}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

</div>



{/* GOLDEN CENTER LINE */}

<div
style={{
position:"absolute",
top:"15%",
bottom:"15%",
left:"50%",

width:4,

background:
"linear-gradient(#fff2b0,#c58b2b)",

transform:
`translateX(-50%) scaleY(${line})`
}}
/>



</AbsoluteFill>

)

}
const CurtainScene = ({image}:{image:string})=>{
 const frame=useCurrentFrame();

 const left=interpolate(
 frame,
 [0,45],
 [0,-100]
 );

 const right=interpolate(
 frame,
 [0,45],
 [0,100]
 );


return(
<AbsoluteFill>

<Img
src={image}
style={{
width:"100%",
height:"100%",
objectFit:"cover",
transform:
`scale(${interpolate(frame,[0,60],[1.15,1])})`
}}
/>


<div
style={{
position:"absolute",
left:0,
top:0,
width:"50%",
height:"100%",
background:"#050505",
transform:
`translateX(${left}%)`
}}
/>


<div
style={{
position:"absolute",
right:0,
top:0,
width:"50%",
height:"100%",
background:"#050505",
transform:
`translateX(${right}%)`
}}
/>


</AbsoluteFill>
)

}
return (

<AbsoluteFill
style={{
background:"#000"
}}
>


{/* SCENE 1 */}
<Sequence
from={0}
durationInFrames={60}
>
<CurtainScene
image={images[0].path}
/>
</Sequence>



{/* SCENE 2 */}
<Sequence
from={60}
durationInFrames={55}
>
<SplitScene
left={images[1].path}
right={images[2].path}
/>
</Sequence>



{/* SCENE 3 TEXT */}
<Sequence
from={115}
durationInFrames={45}
>
<TextScene/>
</Sequence>



{/* SCENE 4 */}
<Sequence
from={160}
durationInFrames={60}
>
<FloatingGallery
images={[
images[3],
images[4],
images[5]
]}
/>
</Sequence>



{/* SCENE 5 */}
<Sequence
from={220}
durationInFrames={55}
>
<HeroScene
image={images[6].path}
/>
</Sequence>



{/* SCENE 6 */}
<Sequence
from={275}
durationInFrames={65}
>
<FilmStrip
images={[
images[7],
images[8],
images[9],
images[10]
]}
/>
</Sequence>



{/* SCENE 7 */}
<Sequence
from={340}
durationInFrames={40}
>
<TextScene
title="Forever Begins"
/>
</Sequence>



{/* SCENE 8 */}
<Sequence
from={380}
durationInFrames={60}
>
<ClosingScene
left={images[11].path}
right={images[12].path}
/>
</Sequence>


</AbsoluteFill>

)

}