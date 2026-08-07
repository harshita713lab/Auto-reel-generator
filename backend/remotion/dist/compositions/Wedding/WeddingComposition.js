import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill, Sequence } from "remotion";
import { generateScenes } from "../../utils/SceneGenrator";
import { AnimatedImage, AnimatedCollage, Overlay, } from "../../components";
const WeddingComposition = ({ images = [], music, beatTimestamps = [], config = {}, }) => {
    const { backgroundColor = "#000", effects = ["vignette"], } = config;
    const scenes = generateScenes(images, beatTimestamps);
    let currentFrame = 0;
    const totalFrames = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    console.log(totalFrames);
    console.log(scenes);
    return (_jsxs(AbsoluteFill, { style: {
            backgroundColor,
        }, children: [scenes.map((scene, index) => {
                const from = currentFrame;
                currentFrame += scene.duration;
                return (_jsx(Sequence, { from: from, durationInFrames: scene.duration, children: scene.layout === "hero" ? (_jsx(AnimatedImage, { src: scene.images[0].path, animation: scene.animation, durationInFrames: scene.duration, style: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        } })) : (_jsx(AnimatedCollage, { layoutType: scene.layout, images: scene.images.map((img) => img.path), animation: scene.animation })) }, index));
            }), effects.includes("vignette") && (_jsx(Overlay, { opacity: 0.12, style: {
                    background: "radial-gradient(circle, transparent 45%, rgba(0,0,0,.45) 100%)",
                } }))] }));
};
export default WeddingComposition;
