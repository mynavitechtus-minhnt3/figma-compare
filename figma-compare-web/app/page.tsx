"use client";

import { useState, useRef, useEffect } from "react";
import { API_ENDPOINTS, FILE_CONSTRAINTS, ZOOM_CONSTRAINTS } from "./constants";
import { ComparisonResult, Bug } from "./types";
import { fetchFigmaImage, compareImages } from "./lib/api";
import BugOverlay from "./components/BugOverlay/BugOverlay";
import ResultsPanel from "./components/ResultsPanel/ResultsPanel";
import { loadImage, resizeImageToMatchWidth } from "./lib/imageUtils";

export default function Home() {
  const [figmaFile, setFigmaFile] = useState<File | null>(null);
  const [actualFile, setActualFile] = useState<File | null>(null);
  const [figmaPreview, setFigmaPreview] = useState<string>("");
  const [actualPreview, setActualPreview] = useState<string>("");
  const [dragActive, setDragActive] = useState<{ figma: boolean; actual: boolean }>({
    figma: false,
    actual: false,
  });

  // New state for Figma URL input
  const [inputMode, setInputMode] = useState<"file" | "url">("file");
  const [figmaUrl, setFigmaUrl] = useState<string>("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // State for sidebar collapse and results panel width
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [resultsPanelWidth, setResultsPanelWidth] = useState(400);

  const figmaInputRef = useRef<HTMLInputElement>(null);
  const actualInputRef = useRef<HTMLInputElement>(null);
  const actualImageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = async (file: File, type: "figma" | "actual") => {
    // Validation
    if (!file.type.match(FILE_CONSTRAINTS.ALLOWED_TYPES)) {
      alert("Only PNG and JPG files are supported");
      return;
    }

    if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
      alert("File size must be less than 20MB");
      return;
    }

    try {
      // Clear previous analysis results when loading new image
      setAiResults(null);
      setShowResults(false);
      setSelectedBugId(null);
      setShowBugOverlays(false);

      if (type === "figma") {
        setFigmaFile(file);
        const img = await loadImage(file);
        setFigmaPreview(img.src);

        // If actual file exists, resize it to match new figma width
        if (actualFile) {
          const resized = await resizeImageToMatchWidth(actualFile, img.width);
          setActualFile(resized.file);
          setActualPreview(resized.previewUrl);
        }
      } else {
        // Type actual
        // Check if figma file exists to resize against
        if (figmaFile) {
          const figmaImg = await loadImage(figmaFile);
          const resized = await resizeImageToMatchWidth(file, figmaImg.width);
          setActualFile(resized.file);
          setActualPreview(resized.previewUrl);
        } else {
          // No figma file yet, just set actual normally
          const img = await loadImage(file);
          setActualFile(file);
          setActualPreview(img.src);
        }
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image");
    }
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
    // Clear previous analysis results when removing image
    setAiResults(null);
    setShowResults(false);
    setSelectedBugId(null);
    setShowBugOverlays(false);

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

  // Fetch image from Figma URL
  const handleFetchFigmaImage = async () => {
    if (!figmaUrl.trim()) {
      alert("Please enter a Figma URL");
      return;
    }

    setIsFetchingUrl(true);
    try {
      const file = await fetchFigmaImage(figmaUrl);

      // Clear previous analysis results when loading new image
      setAiResults(null);
      setShowResults(false);
      setSelectedBugId(null);
      setShowBugOverlays(false);

      setFigmaFile(file);
      const img = await loadImage(file);
      setFigmaPreview(img.src);

      // If actual file exists, resize it to match new figma width
      if (actualFile) {
        const resized = await resizeImageToMatchWidth(actualFile, img.width);
        setActualFile(resized.file);
        setActualPreview(resized.previewUrl);
      }
    } catch (error) {
      console.error("Error fetching Figma image:", error);
      alert("Failed to fetch image from Figma URL. Please check the URL and try again.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const [comparisonMode, setComparisonMode] = useState<"2-up" | "swipe">("2-up");
  const [figmaZoom, setFigmaZoom] = useState(50);
  const [actualZoom, setActualZoom] = useState(50);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [commonImageWidth, setCommonImageWidth] = useState<number | null>(null);

  const swipeContainerRef = useRef<HTMLDivElement>(null);
  const swipeFigmaImageRef = useRef<HTMLImageElement>(null);
  const swipeActualImageRef = useRef<HTMLImageElement>(null);

  const handleZoom = (type: "figma" | "actual", delta: number) => {
    if (comparisonMode === "swipe") return; // Disable zoom in swipe mode
    if (type === "figma") {
      setFigmaZoom((prev) => Math.min(ZOOM_CONSTRAINTS.MAX, Math.max(ZOOM_CONSTRAINTS.MIN, prev + delta)));
    } else if (type === "actual") {
      setActualZoom((prev) => Math.min(ZOOM_CONSTRAINTS.MAX, Math.max(ZOOM_CONSTRAINTS.MIN, prev + delta)));
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !swipeContainerRef.current) return;

    const rect = swipeContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  // Calculate common width when images load in swipe mode
  const calculateCommonWidth = () => {
    if (!swipeFigmaImageRef.current || !swipeActualImageRef.current || !swipeContainerRef.current) return;

    const figmaImg = swipeFigmaImageRef.current;
    const actualImg = swipeActualImageRef.current;
    const container = swipeContainerRef.current;

    // Get natural dimensions
    const figmaRatio = figmaImg.naturalWidth / figmaImg.naturalHeight;
    const actualRatio = actualImg.naturalWidth / actualImg.naturalHeight;

    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const maxWidth = containerRect.width;
    const maxHeight = containerRect.height;

    // Calculate width needed to fit both images fully
    // The width that ensures both images fit within maxHeight
    const widthForFigma = maxHeight * figmaRatio;
    const widthForActual = maxHeight * actualRatio;

    // Use the smaller width to ensure both fit
    let commonWidth = Math.min(widthForFigma, widthForActual, maxWidth);

    setCommonImageWidth(commonWidth);
  };

  // Reset slider position and recalculate width when switching modes
  useEffect(() => {
    if (comparisonMode === "swipe") {
      setSliderPosition(50);
      setCommonImageWidth(null);
      // Recalculate after a short delay to ensure images are rendered
      setTimeout(calculateCommonWidth, 100);
    }
  }, [comparisonMode]);

  const [aiResults, setAiResults] = useState<ComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedBugId, setSelectedBugId] = useState<number | null>(null);
  const [showBugOverlays, setShowBugOverlays] = useState(true);

  const handleAIAnalysis = async () => {
    if (!figmaFile || !actualFile) return;

    setIsAnalyzing(true);
    setAiResults(null);
    setSelectedBugId(null);
    setShowResults(false);
    setShowBugOverlays(false);

    try {
      const results = await compareImages(figmaFile, actualFile, { timeout: 90000 });
      setAiResults(results);
      setShowResults(true);
      setShowBugOverlays(true);
    } catch (error) {
      console.error("Error analyzing images:", error);
      alert(error instanceof Error ? error.message : "Failed to analyze images. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Removed BugOverlay component - now using imported component

  return (
    <div className="app-container" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <header className="sidebar-header">
          <div className="sidebar-header-content">
            <h1 className="sidebar-title">Figma Compare</h1>
            <p className="sidebar-subtitle">Upload images to compare</p>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-icons">
              {sidebarCollapsed ? "menu" : "menu_open"}
            </span>
          </button>
        </header>

        <div className="upload-section">
          {/* Figma Upload */}
          <div className="upload-group">
            <label className="upload-label">Figma Design</label>

            {/* Input Mode Toggle */}
            <div className="input-mode-toggle">
              <label className="input-mode-option">
                <input
                  type="radio"
                  name="inputMode"
                  value="file"
                  checked={inputMode === "file"}
                  onChange={() => setInputMode("file")}
                />
                <span>Upload File</span>
              </label>
              <label className="input-mode-option">
                <input
                  type="radio"
                  name="inputMode"
                  value="url"
                  checked={inputMode === "url"}
                  onChange={() => setInputMode("url")}
                />
                <span>Figma URL</span>
              </label>
            </div>

            {inputMode === "file" ? (
              <>
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
              </>
            ) : (
              <>
                {figmaPreview ? (
                  <div className="preview-container">
                    <img src={figmaPreview} alt="Figma Preview" className="preview-image" />
                    <button className="remove-btn" onClick={() => removeFile("figma")}>
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="url-input-container">
                    <input
                      type="text"
                      className="url-input-field"
                      placeholder="https://www.figma.com/design/..."
                      value={figmaUrl}
                      onChange={(e) => setFigmaUrl(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleFetchFigmaImage()}
                    />
                    <button
                      className="fetch-btn"
                      onClick={handleFetchFigmaImage}
                      disabled={isFetchingUrl}
                    >
                      {isFetchingUrl ? (
                        <>
                          <span className="material-icons spinning">refresh</span>
                          Fetching...
                        </>
                      ) : (
                        <>
                          <span className="material-icons">download</span>
                          Fetch Image
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
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
          <div className="content-wrapper">
            <div className="viewer-container" style={{
              flex: showResults ? `0 0 calc(100% - ${resultsPanelWidth}px)` : '1'
            }}>
              <div className="viewer-area">
                {comparisonMode === "2-up" && (
                  <div className="two-up-view">
                    {/* Figma Image */}
                    <div className="image-wrapper">
                      <div className="image-label">Figma Design</div>
                      <div className="image-scroll-container" style={{ textAlign: 'center' }}>
                        <div style={{
                          position: 'relative',
                          display: 'inline-block',
                          transform: `scale(${figmaZoom / 100})`,
                          transformOrigin: 'top center'
                        }}>
                          <img
                            src={figmaPreview}
                            alt="Figma"
                            className="comparison-img"
                            style={{ transform: 'none', display: 'block', maxWidth: 'none', maxHeight: 'none' }}
                          />
                        </div>
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
                      <div className="image-scroll-container" style={{ position: 'relative', textAlign: 'center' }}>
                        <div style={{
                          position: 'relative',
                          display: 'inline-block',
                          transform: `scale(${actualZoom / 100})`,
                          transformOrigin: 'top center'
                        }}>
                          <img
                            ref={actualImageRef}
                            src={actualPreview}
                            alt="Actual"
                            className="comparison-img"
                            style={{ transform: 'none', display: 'block', maxWidth: 'none', maxHeight: 'none' }}
                          />
                          {aiResults && aiResults.bugs && (
                            <BugOverlay
                              bugs={aiResults.bugs}
                              selectedBugId={selectedBugId}
                              onBugSelect={setSelectedBugId}
                              visible={showBugOverlays}
                              imageRef={actualImageRef}
                            />
                          )}
                        </div>
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
                  <div
                    className="twentytwenty-wrapper"
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                  >
                    <div
                      ref={swipeContainerRef}
                      className="twentytwenty-container"
                      style={commonImageWidth ? { width: `${commonImageWidth}px` } : {}}
                    >
                      {/* Bottom Layer: Actual Implementation */}
                      <img
                        ref={swipeActualImageRef}
                        src={actualPreview}
                        alt="Actual Implementation"
                        className="twentytwenty-before"
                        onLoad={calculateCommonWidth}
                        style={commonImageWidth ? { width: `${commonImageWidth}px` } : {}}
                      />

                      {/* Overlay Layer with Clipping: Figma Design */}
                      <div
                        className="twentytwenty-overlay"
                        style={{
                          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                        }}
                      >
                        <img
                          ref={swipeFigmaImageRef}
                          src={figmaPreview}
                          alt="Figma Design"
                          className="twentytwenty-after"
                          onLoad={calculateCommonWidth}
                          style={commonImageWidth ? { width: `${commonImageWidth}px` } : {}}
                        />
                        <div className="twentytwenty-after-label">
                          Figma Design
                        </div>
                      </div>

                      {/* Handle */}
                      <div
                        className="twentytwenty-handle"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="twentytwenty-handle-center">
                          <span className="twentytwenty-left-arrow"></span>
                          <span className="twentytwenty-right-arrow"></span>
                        </div>
                      </div>

                      {/* Bottom Image Label */}
                      <div className="twentytwenty-before-label">
                        Actual Implementation
                      </div>
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
                {aiResults && aiResults.bugs && aiResults.bugs.length > 0 &&
                  aiResults.bugs.some(bug => Array.isArray(bug.bounding_box) && bug.bounding_box.length === 4) && (
                    <button
                      className={`mode-btn overlay-toggle ${showBugOverlays ? 'active' : ''}`}
                      onClick={() => setShowBugOverlays(!showBugOverlays)}
                      title="Toggle bug overlays"
                    >
                      <span className="material-icons" style={{ fontSize: "16px" }}>
                        {showBugOverlays ? 'visibility' : 'visibility_off'}
                      </span>
                      Overlays
                    </button>
                  )}
              </div>
            </div>

            {/* AI Results Panel - Inline with viewer */}
            {showResults && aiResults && (
              <div
                className="results-panel-container"
                style={{ width: `${resultsPanelWidth}px` }}
              >
                <div
                  className="resize-handle"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    const startWidth = resultsPanelWidth;

                    // Prevent text selection during drag
                    document.body.style.userSelect = 'none';
                    document.body.style.cursor = 'ew-resize';

                    let animationFrameId: number;

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      // Use requestAnimationFrame for smoother updates
                      if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                      }

                      animationFrameId = requestAnimationFrame(() => {
                        const delta = startX - moveEvent.clientX;
                        const newWidth = Math.max(300, Math.min(600, startWidth + delta));
                        setResultsPanelWidth(newWidth);
                      });
                    };

                    const handleMouseUp = () => {
                      // Restore default styles
                      document.body.style.userSelect = '';
                      document.body.style.cursor = '';

                      if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                      }

                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                ></div>
                <ResultsPanel
                  results={aiResults}
                  selectedBugId={selectedBugId}
                  onBugSelect={setSelectedBugId}
                  onClose={() => setShowResults(false)}
                />
              </div>
            )}
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
