import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Upload from "./Upload";
import ImagePreview from "./ImagePreview";
import Result from "./Result";
import TemplateSelector from "./TemplateSelector";
import MusicSelector from "./MusicSelector";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function UploadSection() {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [reelData, setReelData] = useState(null);
  const [useShotstack, setUseShotstack] = useState(false);

  // 1 image = Template38
  const [selectedTemplateId, setSelectedTemplateId] =
    useState("Template38");

  const [selectedMusicId, setSelectedMusicId] =
    useState("template_default");

  const [musicStartTime, setMusicStartTime] = useState(0);

  // =========================================================
  // TEMPLATE MAPPING
  // =========================================================

  const getBestTemplateId = (count) => {
    const countMap = {
      // ⭐ SINGLE IMAGE REEL
      1: "Template38",

      // Existing templates
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

    // Unsupported count -> existing fallback
    return countMap[count] || "simple_1";
  };

  // =========================================================
  // ADD IMAGES
  // =========================================================

  const handleAddImages = (files) => {
    const newImages = [...images, ...files];

    // Maximum 100 images
    if (newImages.length > 100) {
      toast.warning("⚠️ Maximum 100 images allowed");
      return;
    }

    setImages(newImages);

    // Automatically select template according to image count
    const selectedTemplate = getBestTemplateId(
      newImages.length
    );

    setSelectedTemplateId(selectedTemplate);

    // Create preview URLs
    const urls = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setPreviewUrls([...previewUrls, ...urls]);
    setReelData(null);

    toast.info(
      `📸 ${files.length} image(s) added! (Total: ${newImages.length})`
    );
  };

  // =========================================================
  // DELETE IMAGE
  // =========================================================

  const handleDeleteImage = (id) => {
    const index = previewUrls.findIndex(
      (item) => item.id === id
    );

    if (index !== -1) {
      const updatedImages = [...images];

      updatedImages.splice(index, 1);

      setImages(updatedImages);

      const updatedUrls = previewUrls.filter(
        (item) => item.id !== id
      );

      setPreviewUrls(updatedUrls);

      // Recalculate template
      const selectedTemplate = getBestTemplateId(
        updatedImages.length
      );

      setSelectedTemplateId(selectedTemplate);
    }
  };

  // =========================================================
  // CLEAR ALL
  // =========================================================

  const handleClearAll = () => {
    setImages([]);
    setPreviewUrls([]);
    setReelData(null);

    // Default template for next upload
    setSelectedTemplateId("Template38");

    toast.info("🗑️ All images cleared");
  };

  // =========================================================
  // GENERATE REEL
  // =========================================================

  const handleSubmit = async () => {
    // ⭐ Minimum 1 image required
    if (images.length < 1) {
      toast.warning("⚠️ Please upload at least 1 image");
      return;
    }

    setLoading(true);
    setProgress(20);
    setStatus("Uploading...");
    setReelData(null);

    const formData = new FormData();

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      // =====================================================
      // UPLOAD IMAGES
      // =====================================================

      setProgress(30);
      setStatus("Uploading images...");

      const uploadRes = await fetch(
        `${API_URL}/upload/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        const error = await uploadRes.json();

        throw new Error(
          error.error || "Upload failed"
        );
      }

      const uploadData = await uploadRes.json();

      // =====================================================
      // GENERATE REEL
      // =====================================================

      setProgress(60);
      setStatus("Generating reel...");

      const generateUrl = useShotstack
        ? `${API_URL}/reel/generate-shotstack`
        : `${API_URL}/reel/generate`;

      const uploadedImagesList =
        uploadData.files ||
        uploadData.data ||
        uploadData.images ||
        [];

      if (
        !uploadedImagesList ||
        uploadedImagesList.length === 0
      ) {
        throw new Error(
          "Images upload ho gayi par response me files data nahi mila."
        );
      }

      const reelRes = await fetch(generateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: uploadedImagesList,

          // ⭐ 1 image ke case mein Template38
          templateId: selectedTemplateId,

          musicId: selectedMusicId,
          musicStartTime: musicStartTime,
        }),
      });

      if (!reelRes.ok) {
        const error = await reelRes.json();

        throw new Error(
          error.error || "Reel generation failed"
        );
      }

      const reelResponse = await reelRes.json();

      const reelObj =
        reelResponse.data || reelResponse;

      const reelId =
        reelObj._id ||
        reelObj.reelId ||
        reelObj.renderId;

      if (!reelId) {
        throw new Error(
          "Reel ID not returned from server."
        );
      }

      // =====================================================
      // ALREADY RENDERED
      // =====================================================

      if (
        reelObj.status === "rendered" &&
        reelObj.outputUrl
      ) {
        const fileName = reelObj.outputPath
          ? reelObj.outputPath.split("\\").pop()
          : "";

        const outputUrl =
          reelObj.outputUrl ||
          `/output/renders/${fileName}`;

        setProgress(100);
        setStatus("✅ Reel Ready!");

        setReelData({
          outputUrl,
          music: reelObj.usedMusic || "Upbeat",
          template:
            reelObj.usedTemplate ||
            selectedTemplateId ||
            "Auto",
          reelId,
          provider: useShotstack
            ? "Shotstack"
            : "FFmpeg",
        });

        setLoading(false);

        toast.success(
          `🎬 Reel created successfully with ${images.length} image(s)!`
        );

        return;
      }

      // =====================================================
      // POLL RENDER STATUS
      // =====================================================

      setStatus("🎬 Rendering video frames...");

      let pollCount = 0;
      const maxPolls = 120;

      const pollInterval = setInterval(
        async () => {
          pollCount++;

          try {
            const statusRes = await fetch(
              `${API_URL}/reel/${reelId}/status`
            );

            const statusData =
              await statusRes.json();

            if (
              statusRes.ok &&
              statusData.success &&
              statusData.data
            ) {
              const {
                status,
                progress,
                outputPath,
                error,
              } = statusData.data;

              if (progress && progress > 0) {
                setProgress(
                  Math.min(
                    96,
                    Math.max(60, progress)
                  )
                );
              }

              // =============================================
              // RENDERED
              // =============================================

              if (status === "rendered") {
                clearInterval(pollInterval);

                const fileName = outputPath
                  ? outputPath
                      .split(/[\\/]/)
                      .pop()
                  : "";

                const finalOutputUrl =
                  statusData.data.outputUrl ||
                  `/output/renders/${fileName}`;

                setProgress(100);
                setStatus("✅ Reel Ready!");

                setReelData({
                  outputUrl: finalOutputUrl,

                  music:
                    statusData.data.usedMusic ||
                    reelObj.usedMusic ||
                    "Upbeat",

                  template:
                    statusData.data.usedTemplate ||
                    reelObj.usedTemplate ||
                    selectedTemplateId,

                  reelId,

                  provider: useShotstack
                    ? "Shotstack"
                    : "FFmpeg",
                });

                setLoading(false);

                toast.success(
                  "🎬 Reel created successfully!"
                );
              }

              // =============================================
              // FAILED
              // =============================================

              else if (status === "failed") {
                clearInterval(pollInterval);

                setLoading(false);

                toast.error(
                  "❌ Rendering failed: " +
                    (error || "Unknown error")
                );
              }
            }
          } catch (pollErr) {
            console.error(
              "Polling status error:",
              pollErr
            );
          }

          // =============================================
          // TIMEOUT
          // =============================================

          if (pollCount >= maxPolls) {
            clearInterval(pollInterval);

            setLoading(false);

            toast.error(
              "⌛ Rendering took longer than expected. Please check All Reels."
            );
          }
        },
        1500
      );
    } catch (error) {
      console.error("Error:", error);

      toast.error(
        "❌ Error: " + error.message
      );

      setLoading(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    setImages([]);
    setPreviewUrls([]);
    setReelData(null);
    setProgress(0);
    setStatus("");

    // ⭐ Reset to single-image default
    setSelectedTemplateId("Template38");

    toast.info(
      "🔄 Ready to create a new reel!"
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="upload-section">
      <div className="upload-card">
        <h2>📸 Create Your Reel</h2>

        <p>
          Upload 1-100 images and get a
          professional Reel instantly
        </p>

        {!reelData ? (
          <>
            <Upload onAddImages={handleAddImages} />

            {previewUrls.length > 0 && (
              <>
                <div className="preview-header">
                  <h3>
                    📸 {previewUrls.length} Images{" "}
                    {previewUrls.length >= 10
                      ? "🔥"
                      : ""}
                  </h3>

                  <button
                    className="clear-btn"
                    onClick={handleClearAll}
                  >
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
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p>{status}</p>
              </div>
            )}

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={
                loading || images.length < 1
              }
            >
              {loading
                ? "Creating..."
                : `🚀 Create Reel (${images.length} images)`}
            </button>
          </>
        ) : (
          <Result
            reelData={reelData}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default UploadSection;