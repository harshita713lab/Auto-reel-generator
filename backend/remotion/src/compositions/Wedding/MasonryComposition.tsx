import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MusicPlayer } from "../../components";


interface ImageItem {
  path: string;
}


interface WhiteCardMasonryProps {
  images?: ImageItem[];

  music?: {
    path:string;
    volume?:number;
  };

  backgroundColor?:string;
  title?:string;
}



export const WhiteCardMasonry:React.FC<WhiteCardMasonryProps> = ({
  images=[],
  music,
  backgroundColor="#f5f5f5",
  title="Memories"
})=>{


const frame = useCurrentFrame();
const {fps,width} = useVideoConfig();



const imageList = images.slice(0,8);


// two pages

const page1 = imageList.slice(0,6);

const page2 = imageList.slice(2,8);



// slide timing

const slideStart = fps * 5;



const page1X = interpolate(
  frame,
  [
    slideStart,
    slideStart + 25
  ],
  [
    0,
    -width
  ],
  {
    extrapolateLeft:"clamp",
    extrapolateRight:"clamp"
  }
);



const page2X = interpolate(
  frame,
  [
    slideStart,
    slideStart + 25
  ],
  [
    width,
    0
  ],
  {
    extrapolateLeft:"clamp",
    extrapolateRight:"clamp"
  }
);





const renderCard = (
 img:ImageItem,
 index:number
)=>{


const delay=index*8;


const enter=spring({
 fps,
 frame:frame-delay,
 config:{
  damping:15,
  stiffness:80
 }
});



const y=interpolate(
 enter,
 [0,1],
 [100,0]
);


const scale=interpolate(
 enter,
 [0,1],
 [0.85,1]
);



const zoom=interpolate(
 frame,
 [0,fps*10],
 [1,1.08],
 {
  extrapolateRight:"clamp"
 }
);



return (

<div
key={index}
style={{
 flex:1,
 overflow:"hidden",
 borderRadius:24,
 background:"#fff",
 boxShadow:
 "0 20px 50px rgba(0,0,0,.18)",
 transform:
 `
 translateY(${y}px)
 scale(${scale})
 `
}}
>


<Img
src={img.path}
style={{
 width:"100%",
 height:"100%",
 objectFit:"cover",
 transform:`scale(${zoom})`
}}
/>


<div
style={{
position:"absolute",
inset:0,
background:
"linear-gradient(180deg,transparent,rgba(0,0,0,.2))"
}}
/>


</div>

)

};





const renderPage=(page:ImageItem[])=>{


const left=page.filter(
(_,i)=>i%2===0
);

const right=page.filter(
(_,i)=>i%2===1
);



return (

<div
style={{
position:"absolute",
inset:0,
display:"flex",
gap:20,
padding:30
}}
>


<div
style={{
flex:1,
display:"flex",
flexDirection:"column",
gap:20
}}
>

{
left.map((img,i)=>
 renderCard(img,i*2)
)
}

</div>



<div
style={{
flex:1,
display:"flex",
flexDirection:"column",
gap:20
}}
>

{
right.map((img,i)=>
 renderCard(img,i*2+1)
)
}

</div>



</div>

)

}





return (

<AbsoluteFill
style={{
background:backgroundColor,
overflow:"hidden"
}}
>


{
music &&
<MusicPlayer
src={music.path}
volume={music.volume ?? 1}
/>
}




<div
style={{
position:"absolute",
top:50,
width:"100%",
textAlign:"center",
fontSize:45,
fontWeight:300,
letterSpacing:4,
color:"#333",
zIndex:10
}}
>
{title}
</div>




{/* PAGE 1 */}

<div
style={{
position:"absolute",
inset:0,
transform:`translateX(${page1X}px)`
}}
>
{renderPage(page1)}
</div>





{/* PAGE 2 */}

<div
style={{
position:"absolute",
inset:0,
transform:`translateX(${page2X}px)`
}}
>
{renderPage(page2)}
</div>




</AbsoluteFill>

)

};


export default WhiteCardMasonry;