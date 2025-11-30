"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [figmaFile, setFigmaFile] = useState<File | null>(null);
  const [actualFile, setActualFile] = useState<File | null>(null);
  const [figmaPreview, setFigmaPreview] = useState<string>("");
  const [actualPreview, setActualPreview] = useState<string>("");
  const [dragActive, setDragActive] = useState<{ figma: boolean; actual: boolean }>({
    figma: false,
    actual: false,
  });

  const figmaInputRef = useRef<HTMLInputElement>(null);
  const actualInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File, type: "figma" | "actual") => {
    // Validation
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      alert("Only PNG and JPG files are supported");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "figma") {
        setFigmaFile(file);
        setFigmaPreview(e.target?.result as string);
      } else {
        setActualFile(file);
        setActualPreview(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent, type: "figma" | "actual", active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: active }));
  };

  const handleDrop = (e: React.DragEvent, type: "figma" | "actual") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0], type);
    }
  };

  const removeFile = (type: "figma" | "actual") => {
    if (type === "figma") {
      setFigmaFile(null);
      setFigmaPreview("");
      if (figmaInputRef.current) figmaInputRef.current.value = "";
    } else {
      setActualFile(null);
      setActualPreview("");
      if (actualInputRef.current) actualInputRef.current.value = "";
    }
  };

  const [comparisonMode, setComparisonMode] = useState<"2-up" | "swipe" | "onion-skin">("2-up");
  const [figmaZoom, setFigmaZoom] = useState(100);
  const [actualZoom, setActualZoom] = useState(100);
  const [swipeZoom, setSwipeZoom] = useState(100);
  const [onionZoom, setOnionZoom] = useState(100);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [opacity, setOpacity] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const swipeContainerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (type: "figma" | "actual" | "swipe" | "onion", delta: number) => {
    if (type === "figma") {
      setFigmaZoom((prev) => Math.min(200, Math.max(50, prev + delta)));
    } else if (type === "actual") {
      setActualZoom((prev) => Math.min(200, Math.max(50, prev + delta)));
    } else if (type === "swipe") {
      setSwipeZoom((prev) => Math.min(200, Math.max(50, prev + delta)));
    } else {
      setOnionZoom((prev) => Math.min(200, Math.max(50, prev + delta)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !swipeContainerRef.current) return;
    const rect = swipeContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div className="app-container" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Sidebar */}
      <aside className={`sidebar ${figmaFile && actualFile ? "collapsed" : ""}`}>
        <header className="sidebar-header">
          <h1 className="sidebar-title">Figma Compare</h1>
          <p className="sidebar-subtitle">Upload images to compare</p>
        </header>

        <div className="upload-section">
          {/* Figma Upload */}
          <div className="upload-group">
            <label className="upload-label">Figma Design</label>
            <input
              ref={figmaInputRef}
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "figma")}
            />

            {figmaPreview ? (
              <div className="preview-container">
                <img src={figmaPreview} alt="Figma Preview" className="preview-image" />
                <button className="remove-btn" onClick={() => removeFile("figma")}>
                  <span className="material-icons">close</span>
                </button>
              </div>
            ) : (
              <div
                className={`upload-box ${dragActive.figma ? "drag-active" : ""}`}
                onClick={() => figmaInputRef.current?.click()}
                onDragEnter={(e) => handleDrag(e, "figma", true)}
                onDragLeave={(e) => handleDrag(e, "figma", false)}
                onDragOver={(e) => handleDrag(e, "figma", true)}
                onDrop={(e) => handleDrop(e, "figma")}
              >
                <div className="upload-content">
                  <span className="material-icons upload-icon">cloud_upload</span>
                  <span className="upload-text">
                    <span className="upload-link">Click to upload</span> or drag and drop
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actual Upload */}
          <div className="upload-group">
            <label className="upload-label">Actual Implementation</label>
            <input
              ref={actualInputRef}
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "actual")}
            />

            {actualPreview ? (
              <div className="preview-container">
                <img src={actualPreview} alt="Actual Preview" className="preview-image" />
                <button className="remove-btn" onClick={() => removeFile("actual")}>
                  <span className="material-icons">close</span>
                </button>
              </div>
            ) : (
              <div
                className={`upload-box ${dragActive.actual ? "drag-active" : ""}`}
                onClick={() => actualInputRef.current?.click()}
                onDragEnter={(e) => handleDrag(e, "actual", true)}
                onDragLeave={(e) => handleDrag(e, "actual", false)}
                onDragOver={(e) => handleDrag(e, "actual", true)}
                onDrop={(e) => handleDrop(e, "actual")}
              >
                <div className="upload-content">
                  <span className="material-icons upload-icon">cloud_upload</span>
                  <span className="upload-text">
                    <span className="upload-link">Click to upload</span> or drag and drop
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {figmaPreview && actualPreview ? (
          <div className="viewer-container">
            <div className="viewer-area">
              {comparisonMode === "2-up" && (
                <div className="two-up-view">
                  {/* Figma Image */}
                  <div className="image-wrapper">
                    <div className="image-label">Figma Design</div>
                    <div className="image-scroll-container">
                      <img
                        src={figmaPreview}
                        alt="Figma"
                        className="comparison-img"
                        style={{ transform: `scale(${figmaZoom / 100})` }}
                      />
                    </div>
                    <div className="zoom-controls">
                      <button
                        className="zoom-btn"
                        onClick={() => handleZoom("figma", -10)}
                        disabled={figmaZoom <= 50}
                      >
                        <span className="material-icons">remove</span>
                      </button>
                      <span className="zoom-text">{figmaZoom}%</span>
                      <button
                        className="zoom-btn"
                        onClick={() => handleZoom("figma", 10)}
                        disabled={figmaZoom >= 200}
                      >
                        <span className="material-icons">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Actual Image */}
                  <div className="image-wrapper">
                    <div className="image-label">Actual Implementation</div>
                    <div className="image-scroll-container">
                      <img
                        src={actualPreview}
                        alt="Actual"
                        className="comparison-img"
                        style={{ transform: `scale(${actualZoom / 100})` }}
                      />
                    </div>
                    <div className="zoom-controls">
                      <button
                        className="zoom-btn"
                        onClick={() => handleZoom("actual", -10)}
                        disabled={actualZoom <= 50}
                      >
                        <span className="material-icons">remove</span>
                      </button>
                      <span className="zoom-text">{actualZoom}%</span>
                      <button
                        className="zoom-btn"
                        onClick={() => handleZoom("actual", 10)}
                        disabled={actualZoom >= 200}
                      >
                        <span className="material-icons">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {comparisonMode === "swipe" && (
                <div className="swipe-view" onMouseMove={handleMouseMove}>
                  <div className="swipe-container" ref={swipeContainerRef}>
                    <img
                      src={actualPreview}
                      alt="Actual"
                      className="swipe-image"
                      style={{ transform: `scale(${swipeZoom / 100})` }}
                    />
                    <div
                      className="swipe-divider"
                      style={{ left: `${sliderPosition}%` }}
                      onMouseDown={handleMouseDown}
                    >
                      <div className="swipe-handle">
                        <span className="material-icons">code</span>
                      </div>
                    </div>
                    <img
                      src={figmaPreview}
                      alt="Figma"
                      className="swipe-image"
                      style={{
                        transform: `scale(${swipeZoom / 100})`,
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                      }}
                    />
                  </div>
                  <div className="zoom-controls">
                    <button
                      className="zoom-btn"
                      onClick={() => handleZoom("swipe", -10)}
                      disabled={swipeZoom <= 50}
                    >
                      <span className="material-icons">remove</span>
                    </button>
                    <span className="zoom-text">{swipeZoom}%</span>
                    <button
                      className="zoom-btn"
                      onClick={() => handleZoom("swipe", 10)}
                      disabled={swipeZoom >= 200}
                    >
                      <span className="material-icons">add</span>
                    </button>
                  </div>
                </div>
              )}

              {comparisonMode === "onion-skin" && (
                <div className="onion-view">
                  <div className="onion-container">
                    <img
                      src={figmaPreview}
                      alt="Figma"
                      className="onion-image"
                      style={{ transform: `scale(${onionZoom / 100})` }}
                    />
                    <img
                      src={actualPreview}
                      alt="Actual"
                      className="onion-image"
                      style={{
                        transform: `scale(${onionZoom / 100})`,
                        opacity: opacity / 100,
                      }}
                    />
                  </div>
                  <div className="opacity-control">
                    <span className="opacity-label">Opacity</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="opacity-slider"
                    />
                    <span className="opacity-label">{opacity}%</span>
                  </div>
                  <div className="zoom-controls" style={{ bottom: "1rem" }}>
                    <button
                      className="zoom-btn"
                      onClick={() => handleZoom("onion", -10)}
                      disabled={onionZoom <= 50}
                    >
                      <span className="material-icons">remove</span>
                    </button>
                    <span className="zoom-text">{onionZoom}%</span>
                    <button
                      className="zoom-btn"
                      onClick={() => handleZoom("onion", 10)}
                      disabled={onionZoom >= 200}
                    >
                      <span className="material-icons">add</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mode-selector">
              <button
                className={`mode-btn ${comparisonMode === "2-up" ? "active" : ""}`}
                onClick={() => setComparisonMode("2-up")}
              >
                2-up
              </button>
              <button
                className={`mode-btn ${comparisonMode === "swipe" ? "active" : ""}`}
                onClick={() => setComparisonMode("swipe")}
              >
                Swipe
              </button>
              <button
                className={`mode-btn ${comparisonMode === "onion-skin" ? "active" : ""}`}
                onClick={() => setComparisonMode("onion-skin")}
              >
                Onion Skin
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select two images to start comparison</p>
          </div>
        )}
      </main>
    </div>
  );
}
