export interface ReelImage {
  path: string;
  duration: number;
  animation: string;
  transition: string;
}

export interface Scene {
  layout: "hero" | "grid2" | "grid3" | "grid4" | "grid6" | "mosaic";
  images: ReelImage[];
  animation: string;
  transition: string;
  duration: number;
}

const animations = [
  "kenBurns",
  "zoomIn",
  "zoomOut",
  "panLeft",
  "panRight",
  "panUp",
  "panDown",
];

const transitions = [
  "fade",
  "zoom",
  "whip",
  "flash",
  "blur",
  "filmBurn",
];

const layoutPattern: Array<{
  layout: Scene["layout"];
  count: number;
  duration: number;
}> = [
  { layout: "hero", count: 1, duration: 120 },
  { layout: "hero", count: 1, duration: 120},
  { layout: "grid2", count: 2, duration: 20 },
  { layout: "hero", count: 1, duration: 20 },
  { layout: "grid3", count: 3, duration: 20 },
  { layout: "hero", count: 1, duration: 22 },
  { layout: "grid4", count: 4, duration: 22 },
];

function nextAnimation(index: number): string {
  return animations[index % animations.length];
}

function nextTransition(index: number): string {
  return transitions[index % transitions.length];
}

export function generateScenes(images: ReelImage[], beatTimestamps?: number[]): Scene[] {
  const scenes: Scene[] = [];
  const fps = 30;

  // Convert beat timestamps (in seconds) to frame numbers
  const beatFrames: number[] = (beatTimestamps && Array.isArray(beatTimestamps) && beatTimestamps.length > 0)
    ? beatTimestamps.map(ts => Math.round(ts * fps)).filter(f => f > 0).sort((a, b) => a - b)
    : [];

  for (let i = 0; i < images.length; i += 4) {
    const group = images.slice(i, i + 4);

    // Calculate collage scene duration from beat frames if available
    let collageDuration = scenes.length === 0 ? 120 : 45;
    if (beatFrames.length > scenes.length) {
      const prevBeatFrame = scenes.length > 0 ? beatFrames[scenes.length - 1] : 0;
      const targetBeatFrame = beatFrames[scenes.length];
      if (targetBeatFrame > prevBeatFrame) {
        collageDuration = Math.max(15, targetBeatFrame - prevBeatFrame);
      }
    }

    // Collage Scene
    scenes.push({
      layout: group.length === 4
        ? "grid4"
        : group.length === 3
        ? "grid3"
        : group.length === 2
        ? "grid2"
        : "hero",

      images: group,

      animation: "zoomIn",
      transition: "fade",
      duration: collageDuration,
    });

    // Single Scenes
    group.forEach((img, index) => {
      let singleDuration = 60;
      const currentSceneIndex = scenes.length;
      
      if (beatFrames.length > currentSceneIndex) {
        const prevBeatFrame = currentSceneIndex > 0 ? beatFrames[currentSceneIndex - 1] : 0;
        const targetBeatFrame = beatFrames[currentSceneIndex];
        if (targetBeatFrame > prevBeatFrame) {
          singleDuration = Math.max(15, targetBeatFrame - prevBeatFrame);
        }
      }

      scenes.push({
        layout: "hero",
        images: [img],
        animation: index % 2 === 0 ? "slideLeft" : "slideRight",
        transition: "zoom",
        duration: singleDuration,
      });
    });
  }

  return scenes;
}