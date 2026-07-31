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
  { layout: "hero", count: 1, duration: 90 },
  { layout: "hero", count: 1, duration: 90},
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

export function generateScenes(images: ReelImage[]): Scene[] {
  const scenes: Scene[] = [];

  for (let i = 0; i < images.length; i += 4) {

    const group = images.slice(i, i + 4);

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
      duration: 45,
    });

    // Single Scenes
    group.forEach((img) => {
      scenes.push({
        layout: "hero",
        images: [img],
        animation: "kenBurns",
        transition: "zoom",
        duration: 60,
      });
    });
  }

  return scenes;
}