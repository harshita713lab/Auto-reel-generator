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

// =====================================
// SCENE 2
// 2 PHOTO CARDS
// BOTH COME TOGETHER
// DURATION = 3 SECONDS
// =====================================

const Scene2 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // =====================================
  // SCENE 2
  // 6s → 8s
  // 2 PHOTO CARDS
  // =====================================

  const sceneImages = [
    images[0],
    images[10],
    images[1],
    images[11],
  ];

  // =====================================
  // CARD ANIMATION
  // =====================================

  const progress = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 150,
      mass: 0.7,
    },
  });

  const translateY = interpolate(
    progress,
    [0, 1],
    [500, 0],
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
      style={{
        width: 1080,
        height: 1920,

        overflow: "hidden",

        background:
          "linear-gradient(180deg, #d8c9c0 0%, #d9bfd0 48%, #d89da2 100%)",
      }}
    >

      {/* =====================================
          TOP PHOTO CARD
      ===================================== */}

      <div
        style={{
          position: "absolute",

          top: 170,
          left: 45,

          width: 990,
          height: 700,

          opacity,

          transform: `
            translateY(${translateY}px)
            scale(${scale})
          `,

          transformOrigin: "center center",
        }}
      >

        {/* BACK PHOTO */}

        <div
          style={{
            position: "absolute",

            top: 20,
            left: 55,

            width: 900,
            height: 590,

            padding: 20,

            boxSizing: "border-box",

            backgroundColor: "#f1e3d4",

            transform: "rotate(4deg)",

            boxShadow:
              "0 18px 38px rgba(0,0,0,0.16)",
          }}
        >
          <Img
            src={sceneImages[0]?.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>


        {/* FRONT PHOTO */}

        <div
          style={{
            position: "absolute",

            top: 55,
            left: 45,

            width: 900,
            height: 600,

            padding: 20,

            boxSizing: "border-box",

            backgroundColor: "#f5e6d5",

            transform: "rotate(-6deg)",

            boxShadow:
              "0 22px 45px rgba(0,0,0,0.22)",
          }}
        >
          <Img
            src={sceneImages[1]?.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>

      </div>


      {/* =====================================
          BOTTOM PHOTO CARD
      ===================================== */}

      <div
        style={{
          position: "absolute",

          top: 1030,
          left: 45,

          width: 990,
          height: 700,

          opacity,

          transform: `
            translateY(${translateY}px)
            scale(${scale})
          `,

          transformOrigin: "center center",
        }}
      >

        {/* BACK PHOTO */}

        <div
          style={{
            position: "absolute",

            top: 20,
            left: 55,

            width: 900,
            height: 590,

            padding: 20,

            boxSizing: "border-box",

            backgroundColor: "#f1e3d4",

            transform: "rotate(-4deg)",

            boxShadow:
              "0 18px 38px rgba(0,0,0,0.16)",
          }}
        >
          <Img
            src={sceneImages[2]?.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>


        {/* FRONT PHOTO */}

        <div
          style={{
            position: "absolute",

            top: 55,
            left: 45,

            width: 900,
            height: 600,

            padding: 20,

            boxSizing: "border-box",

            backgroundColor: "#f5e6d5",

            transform: "rotate(6deg)",

            boxShadow:
              "0 22px 45px rgba(0,0,0,0.22)",
          }}
        >
          <Img
            src={sceneImages[3]?.path}
            style={{
              width: "100%",
              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>

      </div>

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
  // FIXED SIZES
  // REEL = 1080 x 1920
  // =====================================

  const REEL_WIDTH = 1080;

  const TOP_HEIGHT = 300;
  const MIDDLE_TOP = 320;
  const MIDDLE_HEIGHT = 1280;
  const BOTTOM_HEIGHT = 300;

  // =====================================
  // MIDDLE SLIDER
  // Images 4,5,6,7
  // =====================================

  const middleImages = images.slice(3, 7);

  const slideDuration = 45;

  const totalImages = middleImages.length;

  const sliderPosition =
    totalImages > 0
      ? (frame / slideDuration) % totalImages
      : 0;

  const currentIndex = Math.floor(sliderPosition);

  const progress =
    sliderPosition - currentIndex;

  const translateX =
    -currentIndex * REEL_WIDTH -
    progress * REEL_WIDTH;

  return (
    <AbsoluteFill
      style={{
        width: REEL_WIDTH,
        height: 1920,

        backgroundColor: "#111",

        overflow: "hidden",
      }}
    >

      {/* =====================================
          TOP 3 IMAGES
          EXACT: 1080 x 300
      ===================================== */}

      <div
        style={{
          position: "absolute",

          top: 0,
          left: 0,

          width: REEL_WIDTH,
          height: TOP_HEIGHT,

          display: "flex",

          gap: 6,

          overflow: "hidden",
        }}
      >
        {images.slice(0, 3).map((img, index) => (
          <div
            key={index}
            style={{
              width: 356,
              height: TOP_HEIGHT,

              flex: "0 0 356px",

              overflow: "hidden",
            }}
          >
            <Img
              src={img.path}
              style={{
                width: 356,
                height: TOP_HEIGHT,

                objectFit: "cover",

                objectPosition: "center",

                display: "block",
              }}
            />
          </div>
        ))}
      </div>


      {/* =====================================
          MIDDLE SLIDER
          EXACT: 1080 x 1280
      ===================================== */}

      <div
        style={{
          position: "absolute",

          top: MIDDLE_TOP,
          left: 0,

          width: REEL_WIDTH,
          height: MIDDLE_HEIGHT,

          overflow: "hidden",
        }}
      >

        <div
          style={{
            position: "absolute",

            top: 0,
            left: 0,

            display: "flex",

            width: totalImages * REEL_WIDTH,
            height: MIDDLE_HEIGHT,

            transform: `translateX(${translateX}px)`,

            willChange: "transform",
          }}
        >

          {middleImages.map((img, index) => (
            <div
              key={index}
              style={{
                width: REEL_WIDTH,
                height: MIDDLE_HEIGHT,

                flex: `0 0 ${REEL_WIDTH}px`,

                overflow: "hidden",
              }}
            >
              <Img
                src={img.path}
                style={{
                  width: REEL_WIDTH,
                  height: MIDDLE_HEIGHT,

                  objectFit: "cover",

                  objectPosition: "center",

                  display: "block",
                }}
              />
            </div>
          ))}

        </div>

      </div>


      {/* =====================================
          BOTTOM 3 IMAGES
          EXACT: 1080 x 300
      ===================================== */}

      <div
        style={{
          position: "absolute",

          bottom: 0,
          left: 0,

          width: REEL_WIDTH,
          height: BOTTOM_HEIGHT,

          display: "flex",

          gap: 6,

          overflow: "hidden",
        }}
      >
        {images.slice(7, 10).map((img, index) => (
          <div
            key={index}
            style={{
              width: 356,
              height: BOTTOM_HEIGHT,

              flex: "0 0 356px",

              overflow: "hidden",
            }}
          >
            <Img
              src={img.path}
              style={{
                width: 356,
                height: BOTTOM_HEIGHT,

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
// =====================================
// SCENE 3
// 8s TO 10s
// 3 IMAGES POPUP
// BLACK & WHITE THEME
// =====================================

const Scene3 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene 3 ke liye 3 images
  const sceneImages = images.slice(0, 3);

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        backgroundColor: "#000",

        overflow: "hidden",
      }}
    >
      {sceneImages.map((image, index) => {

        // Har image thodi der baad popup hogi
        const delay = index * 15;

        const localFrame = frame - delay;

        // =====================================
        // POPUP SPRING
        // =====================================

        const progress = spring({
          frame: localFrame,
          fps,

          config: {
            damping: 8,
            stiffness: 220,
            mass: 0.5,
          },
        });

        // =====================================
        // SCALE POPUP
        // =====================================

        const scale = interpolate(
          progress,
          [0, 0.45, 0.75, 1],
          [0.65, 1.08, 0.96, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // =====================================
        // SIDE POPUP
        // =====================================

        const translateX = interpolate(
          progress,
          [0, 0.5, 1],
          [
            index % 2 === 0 ? -180 : 180,
            index % 2 === 0 ? 15 : -15,
            0,
          ],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // =====================================
        // ROTATION
        // =====================================

        const rotate = interpolate(
          progress,
          [0, 0.5, 1],
          [
            index % 2 === 0 ? -10 : 10,
            index % 2 === 0 ? 3 : -3,
            0,
          ],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // =====================================
        // OPACITY
        // =====================================

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

              backgroundColor: "#000",
            }}
          >
            <Img
              src={image.path}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                // BLACK & WHITE
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
// =====================================
// SCENE 4
// 10s TO 15s
// 4 IMAGES
// ZOOM IN → ZOOM OUT → ZOOM IN → ZOOM OUT
// =====================================

const Scene4 = ({
  images = [],
}: {
  images: ImageItem[];
}) => {
  const frame = useCurrentFrame();

  // Scene 4 ke 4 images
  const sceneImages = images.slice(0, 4);

  // Total = 150 frames
  // 5 seconds @ 30 FPS
  const imageDuration = 37.5;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,

        backgroundColor: "#000",

        overflow: "hidden",
      }}
    >
      {sceneImages.map((image, index) => {
        // =====================================
        // IMAGE START
        // =====================================

        const imageStart = index * imageDuration;

        const localFrame = frame - imageStart;

        // =====================================
        // ZOOM DIRECTION
        // Even = Zoom In
        // Odd  = Zoom Out
        // =====================================

        const isZoomIn = index % 2 === 0;

        const scale = isZoomIn
          ? interpolate(
              localFrame,
              [0, imageDuration],
              [1, 1.18],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            )
          : interpolate(
              localFrame,
              [0, imageDuration],
              [1.18, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

        // =====================================
        // FADE IN
        // =====================================

        const opacity = interpolate(
          localFrame,
          [0, 6, imageDuration],
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
          SCENE 3 — 8s to 10s
          60 FRAMES
      ===================================== */}

      <Sequence
        from={240}
        durationInFrames={60}
      >
        <Scene3 images={images} />
      </Sequence>


      {/* =====================================
          10s to 11s
          1 SECOND GAP
          30 FRAMES
      ===================================== */}


      {/* =====================================
          SCENE 4 — 11s to 15s
          120 FRAMES
      ===================================== */}

      <Sequence
        from={330}
        durationInFrames={120}
      >
        <Scene4 images={images} />
      </Sequence>
    </>
  );
};