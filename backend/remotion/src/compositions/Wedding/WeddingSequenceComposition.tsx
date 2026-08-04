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

  const fastDuration = 180;


  const totalDuration =
    rowDuration +
    fastDuration 
  

  // Images

  const img1 = images[0];
  const img2 = images[1];
  const img3 = images[2];

  const img4 = images[3];
  const img5 = images[4];
  const img6 = images[5];
  const img7 = images[6];
  const img8 = images[7];
const img9 = images[8];
const img10 = images[9];
const img11 = images[10];
const img12 = images[11];
const img13 = images[12];
const img14 = images[13];
const img15 = images[14];
const img16 = images[15];

const img17 = images[16];
const img18 = images[17];
const img19 = images[18];
const img20 = images[19];
  const img21 = images[20];
  const img22 = images[21];
  const img23 = images[22];

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
        height: "100%",
        objectFit: "cover",
        borderRadius: 18,
      }}
    />
  );
};
// -----------------------------------
// Rotating Card Image
// -----------------------------------




  // -----------------------------------
  // Fast Image
  // -----------------------------------


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
<Sequence from={0} durationInFrames={120}>

<div
style={{
 position:"absolute",
 top:"0%",
 left:0,
 width:"100%",
 height:"33%",
}}
>

<RowImage image={img1}/>

<div
style={{
 position:"absolute",
 inset:0,
 display:"flex",
 justifyContent:"center",
 alignItems:"center",
 zIndex:10,
 color:"#fff",
 fontSize:45,
 fontWeight:900,
 letterSpacing:8,
 textTransform:"uppercase",
 textShadow:"0 5px 20px rgba(0,0,0,.8)"
}}
>
Camera
</div>

</div>

</Sequence>



{/* Row 2 */}
<Sequence from={45} durationInFrames={75}>

<div
style={{
 position:"absolute",
 top:"33%",
 left:0,
 width:"100%",
 height:"33%",
}}
>

<RowImage image={img2}/>

<div
style={{
 position:"absolute",
 inset:0,
 display:"flex",
 justifyContent:"center",
 alignItems:"center",
 zIndex:10,
 color:"#fff",
 fontSize:45,
 fontWeight:900,
 letterSpacing:8,
 textShadow:"0 5px 20px rgba(0,0,0,.8)"
}}
>
Rolling
</div>

</div>

</Sequence>




{/* Row 3 */}
<Sequence from={105} durationInFrames={15}>

<div
style={{
 position:"absolute",
 top:"66%",
 left:0,
 width:"100%",
 height:"34%",
}}
>

<RowImage image={img3}/>

<div
style={{
 position:"absolute",
 inset:0,
 display:"flex",
 justifyContent:"center",
 alignItems:"center",
 zIndex:10,
 color:"#fff",
 fontSize:45,
 fontWeight:900,
 letterSpacing:8,
 textShadow:"0 5px 20px rgba(0,0,0,.8)"
}}
>
Action
</div>

</div>

</Sequence>


</AbsoluteFill>

</Sequence>


   

<Sequence
  from={rowDuration}
  durationInFrames={fastDuration}
>
  <AbsoluteFill>

    {[img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20, img21, img22, img23].map((img, index) => (
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
    
     
    </AbsoluteFill>
  );
};

export default WeddingSequenceComposition;