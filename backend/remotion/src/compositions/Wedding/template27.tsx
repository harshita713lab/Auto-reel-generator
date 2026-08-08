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
  path: string;
}
interface Template27Props {
  images?: ImageItem[];
}
// =====================================
// SCENE 1
// TOP 3 FIXED + MIDDLE SLIDER + BOTTOM 3 FIXED
// =====================================

const Scene2 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene 2 ke first 5 images
  const sceneImages = images.slice(0, 5);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f5f1eb",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {sceneImages.map((image, index) => {
        // Har card 7 frames ke gap se enter hoga
        const delay = index * 7;

        const progress = spring({
          frame: frame - delay,
          fps,
          config: {
            damping: 14,
            stiffness: 150,
            mass: 0.8,
          },
        });

        const translateY = interpolate(
          progress,
          [0, 1],
          [-500, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const scale = interpolate(
          progress,
          [0, 1],
          [0.75, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // Har card ka thoda different rotation
        const rotations = [-8, 6, -5, 8, -3];

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: 520,
              height: 680,

              backgroundColor: "white",

              padding: 18,

              boxSizing: "border-box",

              boxShadow:
                "0 18px 45px rgba(0,0,0,0.22)",

              transform: `
                translateY(${translateY}px)
                scale(${scale})
                rotate(${rotations[index % rotations.length]}deg)
              `,

              zIndex: index,

              transformOrigin: "center center",
            }}
          >
            <Img
              src={image.path}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const Scene1 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {

  const frame = useCurrentFrame();

  // =====================================
  // MIDDLE SLIDER
  // =====================================

  const middleImages = images.slice(6, 10);

  const imageWidth = 716;

  // har image ke beech slide
  const slideDuration = 45;

  const totalImages = middleImages.length;

  const sliderPosition =
    (frame / slideDuration) % totalImages;

  const currentIndex =
    Math.floor(sliderPosition);

  const progress =
    sliderPosition - currentIndex;

  const translateX =
    -currentIndex * imageWidth -
    progress * imageWidth;


  return (
    <AbsoluteFill
      style={{
        background: "#111",
        overflow: "hidden",
      }}
    >

      {/* =================================
          TOP ROW
          FIXED 3 IMAGES
      ================================= */}

      <div
        style={{
          position: "absolute",

          top: 0,
          left: 0,

          width: "100%",
          height: 310,

          display: "flex",

          gap: 10,

          padding: 12,

          boxSizing: "border-box",

          background: "#111",
        }}
      >

        {images.slice(0, 3).map((img, index) => (

          <div
            key={index}
            style={{
              flex: 1,

              height: "100%",

              overflow: "hidden",

              borderRadius: 10,

              background: "#111",
            }}
          >

            <Img
              src={img.path}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",
                objectPosition: "center",

                display: "block",
              }}
            />

          </div>

        ))}

      </div>


      {/* =================================
          MIDDLE SLIDER
      ================================= */}

      <div
        style={{
          position: "absolute",

          top: 320,
          left: 0,

          width: "100%",
          height: 635,

          overflow: "hidden",

          background: "#111",
        }}
      >

        <div
          style={{
            display: "flex",

            height: "100%",

            width: `${totalImages * 100}%`,

            transform:
              `translateX(${translateX}px)`,

            willChange: "transform",
          }}
        >

          {middleImages.map((img, index) => (

            <div
              key={index}
              style={{
                width: imageWidth,
                height: "100%",

                flexShrink: 0,

                overflow: "hidden",
              }}
            >

              <Img
                src={img.path}
                style={{
                  width: "100%",
                  height: "100%",

                  objectFit: "cover",
                  objectPosition: "center",

                  display: "block",
                }}
              />

            </div>

          ))}

        </div>

      </div>


      {/* =================================
          BOTTOM ROW
          FIXED 3 IMAGES
      ================================= */}

      <div
        style={{
          position: "absolute",

          bottom: 0,
          left: 0,

          width: "100%",
          height: 310,

          display: "flex",

          gap: 10,

          padding: 12,

          boxSizing: "border-box",

          background: "#111",
        }}
      >

        {images.slice(10, 13).map((img, index) => (

          <div
            key={index}
            style={{
              flex: 1,

              height: "100%",

              overflow: "hidden",

              borderRadius: 10,

              background: "#111",
            }}
          >

            <Img
              src={img.path}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",
                objectPosition: "center",

                display: "block",
              }}
            />

          </div>

        ))}

      </div>

    </AbsoluteFill>
  );
};
const Scene3 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneImages = images.slice(0, 4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {sceneImages.map((image, index) => {
        // Har image ek-ek karke
        const delay = index * 25;

        const progress = spring({
          frame: frame - delay,
          fps,
          config: {
            damping: 7,
            stiffness: 260,
            mass: 0.45,
          },
        });

        // Jhatke wala scale
        const scale = interpolate(
          progress,
          [0, 0.45, 0.75, 1],
          [1.35, 0.92, 1.08, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // Thoda side se jhatka
        const translateX = interpolate(
          progress,
          [0, 0.5, 1],
          [
            index % 2 === 0 ? -120 : 120,
            index % 2 === 0 ? 20 : -20,
            0,
          ],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // Chhota rotation jhatka
        const rotate = interpolate(
          progress,
          [0, 0.5, 1],
          [
            index % 2 === 0 ? -8 : 8,
            index % 2 === 0 ? 3 : -3,
            0,
          ],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const opacity = interpolate(
          progress,
          [0, 0.15, 1],
          [0, 1, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity,

              transform: `
                translateX(${translateX}px)
                scale(${scale})
                rotate(${rotate}deg)
              `,

              zIndex: index,
            }}
          >
            <Img
              src={image.path}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                filter: "grayscale(100%)",

                display: "block",
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
const Scene4 = ({ images = [] }: { images: ImageItem[] }) => {
  const frame = useCurrentFrame();

  const sceneImages = images.slice(0, 4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {sceneImages.map((image, index) => {

        // Har image ko 30 frames milenge
        const imageStart = index * 30;

        const localFrame = frame - imageStart;

        // Image 1 = zoom in
        // Image 2 = zoom out
        // Image 3 = zoom in
        // Image 4 = zoom out
        const isZoomIn = index % 2 === 0;

        const scale = isZoomIn
          ? interpolate(
              localFrame,
              [0, 30],
              [1, 1.18],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            )
          : interpolate(
              localFrame,
              [0, 30],
              [1.18, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity: interpolate(
                localFrame,
                [0, 8, 30],
                [0, 1, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              ),

              transform: `scale(${scale})`,

              zIndex: index,
            }}
          >
            <Img
              src={image.path}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                display: "block",
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
export const Template27 = ({
  images = [],
}: Template27Props) => {
  return (
    <>
      {/* =====================================
          SCENE 1 — 0s to 6s
          180 FRAMES
      ===================================== */}
      <Sequence
        from={0}
        durationInFrames={180}
      >
        <Scene1 images={images} />
      </Sequence>

      {/* =====================================
          SCENE 2 — 6s to 8s
          60 FRAMES
      ===================================== */}
      <Sequence
        from={180}
        durationInFrames={60}
      >
        <Scene2 images={images} />
      </Sequence>

      {/* =====================================
          SCENE 3 — 9s to 12s
          90 FRAMES
      ===================================== */}
      <Sequence
        from={270}
        durationInFrames={90}
      >
        <Scene3 images={images} />
      </Sequence>

      {/* =====================================
          SCENE 4 — 12s to 15s
          90 FRAMES
      ===================================== */}
      <Sequence
        from={360}
        durationInFrames={90}
      >
        <Scene4 images={images} />
      </Sequence>
    </>
  );
};