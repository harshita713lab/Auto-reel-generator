// frontend/src/components/UploadSection.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Upload from "./Upload";
import ImagePreview from "./ImagePreview";
import Result from "./Result";
import TemplateSelector from "./TemplateSelector";
import MusicSelector from "./MusicSelector";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function UploadSection() {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [reelData, setReelData] = useState(null);
  const [useShotstack, setUseShotstack] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("simple_1");
  const [selectedMusicId, setSelectedMusicId] = useState("template_default");
  const [musicStartTime, setMusicStartTime] = useState(0);

  const handleAddImages = (files) => {
    const newImages = [...images, ...files];

    // ✅ Allow up to 100 images
    if (newImages.length > 100) {
      toast.warning("⚠️ Maximum 100 images allowed");
      return;
    }

    setImages(newImages);

    // Auto-select template based on exact photo count compatibility
    const count = newImages.length;
    const getBestTemplateId = (cnt) => {
      const countMap = {
        3: "Template21",
        4: "premium_grid",
        5: "Template5",
        7: "Template19",
        8: "white_masonry",
        9: "Template29",
        10: "Template28",
        11: "wedding_split",
        12: "Template6",
        13: "Template16",
        14: "wedding_seq",
        15: "cinematic_wedding",
        16: "white_carousel",
        17: "Template18",
        18: "white_polaroid",
        19: "Template34",
        22: "Template28",
        23: "Template12",
        24: "Template25",
        25: "Template35",
      };
      return countMap[cnt] || "simple_1";
    };
    setSelectedTemplateId(getBestTemplateId(count));

    const urls = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setPreviewUrls([...previewUrls, ...urls]);
    setReelData(null);
    toast.info(
      `📸 ${files.length} image(s) added! (Total: ${newImages.length})`,
    );
  };

  const handleDeleteImage = (id) => {
    const index = previewUrls.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);

      const updatedUrls = previewUrls.filter((item) => item.id !== id);
      setPreviewUrls(updatedUrls);
    }
  };

  const handleClearAll = () => {
    setImages([]);
    setPreviewUrls([]);
    setReelData(null);
    toast.info("🗑️ All images cleared");
  };

  const handleSubmit = async () => {
    // ✅ Minimum 1 photo required
    if (images.length < 2) {
      // Changed from 1 to 2 to match backend RENDER_CONFIG.MIN_IMAGES
      toast.warning("⚠️ Please upload at least 2 images");
      return;
    }

    setLoading(true);
    setProgress(20);
    setStatus("Uploading...");
    setReelData(null);

    const formData = new FormData();
    images.forEach((file) => formData.append("images", file));

    try {
      setProgress(30);
      setStatus("Uploading images...");

      // ✅ FIX HERE: Changed `${API_URL}/upload` to `${API_URL}/upload/images`
      const uploadRes = await fetch(`${API_URL}/upload/images`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(error.error || "Upload failed");
      }

      const uploadData = await uploadRes.json();

      setProgress(60);
      setStatus("Generating reel...");

      const generateUrl = useShotstack
        ? `${API_URL}/reel/generate-shotstack`
        : `${API_URL}/reel/generate`;

      // ✅ Safe Extraction: check multiple keys for uploaded files
      const uploadedImagesList =
        uploadData.files || uploadData.data || uploadData.images || [];

      if (!uploadedImagesList || uploadedImagesList.length === 0) {
        throw new Error(
          "Images upload to ho gayi par response me files data nahi mila.",
        );
      }

      const reelRes = await fetch(generateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: uploadedImagesList,
          templateId: selectedTemplateId,
          musicId: selectedMusicId,
          musicStartTime: musicStartTime,
        }),
      });

      if (!reelRes.ok) {
        const error = await reelRes.json();
        throw new Error(error.error || "Reel generation failed");
      }

      const reelResponse = await reelRes.json();
      const reelObj = reelResponse.data || reelResponse;
      const reelId = reelObj._id || reelObj.reelId || reelObj.renderId;

      if (!reelId) {
        throw new Error("Reel ID not returned from server.");
      }

      // If already rendered immediately (e.g. shotstack or cached)
      if (reelObj.status === 'rendered' && reelObj.outputUrl) {
        const fileName = reelObj.outputPath ? reelObj.outputPath.split("\\").pop() : "";
        const outputUrl = reelObj.outputUrl || `/output/renders/${fileName}`;
        setProgress(100);
        setStatus("✅ Reel Ready!");
        setReelData({
          outputUrl,
          music: reelObj.usedMusic || "Upbeat",
          template: reelObj.usedTemplate || "Auto",
          reelId,
          provider: useShotstack ? "Shotstack" : "FFmpeg",
        });
        setLoading(false);
        toast.success(`🎬 Reel created successfully with ${images.length} images!`);
        return;
      }

      // Poll background status every 1.5s until rendering finishes
      setStatus("🎬 Rendering video frames...");
      let pollCount = 0;
      const maxPolls = 120; // 3 minutes timeout safety

      const pollInterval = setInterval(async () => {
        pollCount++;
        try {
          const statusRes = await fetch(`${API_URL}/reel/${reelId}/status`);
          const statusData = await statusRes.json();

          if (statusRes.ok && statusData.success && statusData.data) {
            const { status, progress, outputPath, error } = statusData.data;

            if (progress && progress > 0) {
              setProgress(Math.min(96, Math.max(60, progress)));
            }

            if (status === 'rendered') {
              clearInterval(pollInterval);
              const fileName = outputPath ? outputPath.split(/[\\/]/).pop() : "";
              const finalOutputUrl = statusData.data.outputUrl || `/output/renders/${fileName}`;
              setProgress(100);
              setStatus("✅ Reel Ready!");
              setReelData({
                outputUrl: finalOutputUrl,
                music: statusData.data.usedMusic || reelObj.usedMusic || "Upbeat",
                template: statusData.data.usedTemplate || reelObj.usedTemplate || "Auto",
                reelId,
                provider: useShotstack ? "Shotstack" : "FFmpeg",
              });
              setLoading(false);
              toast.success(`🎬 Reel created successfully!`);
            } else if (status === 'failed') {
              clearInterval(pollInterval);
              setLoading(false);
              toast.error("❌ Rendering failed: " + (error || "Unknown error"));
            }
          }
        } catch (pollErr) {
          console.error("Polling status error:", pollErr);
        }

        if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          setLoading(false);
          toast.error("⌛ Rendering took longer than expected. Please check All Reels.");
        }
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error("❌ Error: " + error.message);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setPreviewUrls([]);
    setReelData(null);
    setProgress(0);
    setStatus("");
    toast.info("🔄 Ready to create a new reel!");
  };

  return (
    <div className="upload-section">
      <div className="upload-card">
        <h2>📸 Create Your Reel</h2>
        <p>Upload 1-100 images and get a professional Reel instantly</p>

        {!reelData ? (
          <>
            <Upload onAddImages={handleAddImages} />

            {previewUrls.length > 0 && (
              <>
                <div className="preview-header">
                  <h3>
                    📸 {previewUrls.length} Images{" "}
                    {previewUrls.length >= 10 ? "🔥" : ""}
                  </h3>
                  <button className="clear-btn" onClick={handleClearAll}>
                    🗑️ Clear All
                  </button>
                </div>
                <ImagePreview
                  images={previewUrls}
                  onDelete={handleDeleteImage}
                />

                <TemplateSelector
                  onSelect={setSelectedTemplateId}
                  selectedId={selectedTemplateId}
                  imageCount={images.length}
                />
              </>
            )}

            {loading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p>{status}</p>
              </div>
            )}

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading || images.length < 2} // 👈 1 ko 2 kar diya
            >
              {loading
                ? "Creating..."
                : `🚀 Create Reel (${images.length} images)`}
            </button>

            {images.length > 0 && images.length < 2 && (
              <p className="hint" style={{ color: "#ff4757" }}>
                ⚠️ Need at least 2 images to generate a reel
              </p>
            )}
          </>
        ) : (
          <Result reelData={reelData} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default UploadSection;
