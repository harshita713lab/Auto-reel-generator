import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AbsoluteFill } from "remotion";
import AnimatedImage from "./AnimatedImage";
import { heroLayout, grid2Layout, grid3Layout, grid4Layout, grid6Layout, mosaicLayout, } from "../layouts";
const layouts = {
    hero: heroLayout,
    grid2: grid2Layout,
    grid3: grid3Layout,
    grid4: grid4Layout,
    grid6: grid6Layout,
    mosaic: mosaicLayout,
};
const imageAnimations = [
    "kenBurns",
    "panLeft",
    "zoomIn",
    "panRight",
    "zoomOut",
    "panUp",
];
export const AnimatedCollage = ({ images, layoutType, animation = "kenBurns", }) => {
    const selectedLayout = layouts[layoutType] || grid4Layout;
    if (images.length === 0)
        return null;
    return (_jsxs(AbsoluteFill, { children: [_jsx(AnimatedImage, { src: images[0], animation: "kenBurns", durationInFrames: 90, style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "blur(35px) brightness(0.55)",
                    transform: "scale(1.25)",
                } }), _jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.18)",
                } }), selectedLayout.map((box, index) => {
                const currentImage = images[index];
                if (!currentImage)
                    return null;
                return (_jsx("div", { style: {
                        position: "absolute",
                        left: box.x,
                        top: box.y,
                        width: box.width,
                        height: box.height,
                        overflow: "hidden",
                        background: "#fff",
                        padding: 8,
                        borderRadius: ("radius" in box ? box.radius : 18) ?? 18,
                        transform: `rotate(${"rotate" in box ? box.rotate : 0}deg)`,
                        boxShadow: "0 18px 45px rgba(0,0,0,.28)",
                        zIndex: ("zIndex" in box ? box.zIndex : index + 1) ?? 1,
                    }, children: _jsx(AnimatedImage, { src: currentImage, animation: imageAnimations[index] ?? animation, durationInFrames: 150, style: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 12,
                        } }) }, index));
            })] }));
};
export default AnimatedCollage;
