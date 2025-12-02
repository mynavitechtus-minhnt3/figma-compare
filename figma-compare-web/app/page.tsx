"use client";

import { useState, useRef } from "react";
import { API_ENDPOINTS, FILE_CONSTRAINTS, ZOOM_CONSTRAINTS } from "./constants";

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
    if (!file.type.match(FILE_CONSTRAINTS.ALLOWED_TYPES)) {
      alert("Only PNG and JPG files are supported");
      return;
    }

    if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
      alert("File size must be less than 20MB");
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

  const [comparisonMode, setComparisonMode] = useState<"2-up" | "swipe">("2-up");
  const [figmaZoom, setFigmaZoom] = useState(100);
  const [actualZoom, setActualZoom] = useState(100);
  const [swipeZoom, setSwipeZoom] = useState(100);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const swipeContainerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (type: "figma" | "actual" | "swipe", delta: number) => {
    if (type === "figma") {
      setFigmaZoom((prev) => Math.min(ZOOM_CONSTRAINTS.MAX, Math.max(ZOOM_CONSTRAINTS.MIN, prev + delta)));
    } else if (type === "actual") {
      setActualZoom((prev) => Math.min(ZOOM_CONSTRAINTS.MAX, Math.max(ZOOM_CONSTRAINTS.MIN, prev + delta)));
    } else {
      setSwipeZoom((prev) => Math.min(ZOOM_CONSTRAINTS.MAX, Math.max(ZOOM_CONSTRAINTS.MIN, prev + delta)));
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

  const [aiResults, setAiResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleAIAnalysis = async () => {
    if (!figmaFile || !actualFile) return;

    setIsAnalyzing(true);
    setAiResults(null);

    const formData = new FormData();
    formData.append("files", figmaFile);
    formData.append("files", actualFile);

    try {
      const response = await fetch(API_ENDPOINTS.COMPARE_AI, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAiResults(data);
      setShowAiModal(true);
    } catch (error) {
      console.error("Error analyzing images:", error);
      alert("Failed to analyze images. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
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
                        onClick={() => handleZoom("figma", -ZOOM_CONSTRAINTS.STEP)}
                        disabled={figmaZoom <= ZOOM_CONSTRAINTS.MIN}
                      >
                        <span className="material-icons">remove</span>
                      </button>
                      <span className="zoom-text">{figmaZoom}%</span>
                      <button
                        className="zoom-btn"
                        onClick={() => handleZoom("figma", ZOOM_CONSTRAINTS.STEP)}
                        disabled={figmaZoom >= ZOOM_CONSTRAINTS.MAX}
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
                        onClick={() => handleZoom("actual", -ZOOM_CONSTRAINTS.STEP)}
                        disabled={actualZoom <= ZOOM_CONSTRAINTS.MIN}
                      >
                        <span className="material-icons">remove</span>
                      </button>
                      <span className="zoom-text">{actualZoom}%</span>
                      <button
                        className="zoom-btn"
                        onClick={() => handleZoom("actual", ZOOM_CONSTRAINTS.STEP)}
                        disabled={actualZoom >= ZOOM_CONSTRAINTS.MAX}
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
                      onClick={() => handleZoom("swipe", -ZOOM_CONSTRAINTS.STEP)}
                      disabled={swipeZoom <= ZOOM_CONSTRAINTS.MIN}
                    >
                      <span className="material-icons">remove</span>
                    </button>
                    <span className="zoom-text">{swipeZoom}%</span>
                    <button
                      className="zoom-btn"
                      onClick={() => handleZoom("swipe", ZOOM_CONSTRAINTS.STEP)}
                      disabled={swipeZoom >= ZOOM_CONSTRAINTS.MAX}
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
                className="mode-btn ai-btn"
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                <span className="material-icons" style={{ marginLeft: "8px", fontSize: "16px" }}>
                  auto_awesome
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select two images to start comparison</p>
          </div>
        )}

        {/* AI Results Modal */}
        {showAiModal && aiResults && (
          <div className="modal-overlay" onClick={() => setShowAiModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>AI Analysis Results</h2>
                <button className="close-btn" onClick={() => setShowAiModal(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                {aiResults.issues && aiResults.issues.length > 0 ? (
                  <ul className="issues-list">
                    {aiResults.issues.map((issue: any, index: number) => (
                      <li key={index} className={`issue-item ${issue.severity.toLowerCase()}`}>
                        <div className="issue-header">
                          <span className="issue-type">{issue.type}</span>
                          <span className="issue-severity">{issue.severity}</span>
                        </div>
                        <p className="issue-description">{issue.description}</p>
                        {issue.suggestion && (
                          <p className="issue-suggestion">💡 {issue.suggestion}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-issues">
                    <span className="material-icons check-icon">check_circle</span>
                    <p>No discrepancies found! Great job.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
