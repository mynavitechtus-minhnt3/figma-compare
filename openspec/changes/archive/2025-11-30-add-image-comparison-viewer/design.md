# Design: Image Comparison Viewer

## Context
The Figma Compare tool needs a core viewer component that allows developers to upload and compare UI screenshots against Figma designs. The viewer must support multiple comparison modes to accommodate different inspection workflows and ensure images are displayed without cropping.

## Goals
- Simple, intuitive file upload (click or drag-and-drop)
- Three distinct comparison modes for different use cases
- Zoom capability for detailed inspection
- Fit-height display to show full image content
- Responsive layout that maximizes comparison space
- Modern, professional UI with dark mode support

## Non-Goals
- Video comparison
- Batch upload of multiple image pairs
- Cloud storage or persistence (deferred to future)
- Real-time collaboration
- Annotation or markup tools

## Decisions

### Three Comparison Modes
**Decision**: Implement 2-up, Swipe, and Onion Skin modes

**Rationale**:
- **2-up**: Best for comparing overall layout and structure
- **Swipe**: Best for pixel-perfect alignment checks
- **Onion Skin**: Best for detecting subtle color/opacity differences

Each mode serves a distinct purpose in the comparison workflow.

### Fit-Height Strategy
**Decision**: Use `max-height: 100%` and `max-width: 100%` with `align-items: flex-start`

**Problem**: Previous implementation used `height: 100%` which caused images to be cropped when aspect ratios didn't match container.

**Solution**:
```css
.comparison-img {
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.image-scroll-container {
  align-items: flex-start; /* Not center */
  padding: 0.5rem;
}
```

This ensures full image visibility while maintaining aspect ratio.

### Zoom Implementation
**Decision**: CSS transforms with 50%-200% range

**Rationale**:
- CSS transforms are GPU-accelerated (smooth performance)
- 50% minimum allows seeing full context
- 200% maximum provides sufficient detail without excessive pixelation
- 10% increments provide good granularity

**Alternative considered**: Canvas-based zoom - rejected due to complexity and performance overhead.

### Layout Responsiveness
**Decision**: Dynamic sidebar collapse when images are loaded

**Behavior**:
- Default: Sidebar 320px, viewer normal size
- With images: Sidebar 180px, viewer expands 3x
- Mobile (< 768px): Sidebar stacks on top

**Rationale**: Maximizes comparison space when actually comparing, while keeping upload controls accessible.

### File Upload UX
**Decision**: Support both click and drag-and-drop

**Rationale**:
- Click: Familiar, works on all devices
- Drag-and-drop: Faster for desktop users, more modern UX
- Both together: Best of both worlds

### State Management
**Decision**: React hooks (useState, useRef, useEffect)

**State structure**:
```typescript
const [figmaFile, setFigmaFile] = useState<File | null>(null);
const [actualFile, setActualFile] = useState<File | null>(null);
const [figmaPreview, setFigmaPreview] = useState<string>("");
const [actualPreview, setActualPreview] = useState<string>("");
const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("2-up");
const [figmaZoom, setFigmaZoom] = useState(100);
const [actualZoom, setActualZoom] = useState(100);
const [swipeZoom, setSwipeZoom] = useState(100);
const [onionZoom, setOnionZoom] = useState(100);
const [sliderPosition, setSliderPosition] = useState(50);
const [opacity, setOpacity] = useState(100);
```

**Rationale**: Separate zoom states per mode allow independent control in 2-up mode while maintaining synchronized zoom in Swipe/Onion Skin modes.

## Risks / Trade-offs

### Risk: Large image performance
**Mitigation**:
- File size limit (10MB)
- CSS transforms for zoom (GPU-accelerated)
- Lazy loading of images
- Debounced slider movements

### Risk: Browser compatibility
**Mitigation**:
- Use standard APIs (FileReader, localStorage)
- Test on Chrome, Firefox, Safari, Edge
- Provide fallbacks for older browsers

### Trade-off: Client-side vs Server-side processing
**Chosen**: Client-side
**Trade-off**:
- ✅ No server costs, works offline, instant preview
- ❌ Limited by browser capabilities, no server-side optimization
- **Decision**: Acceptable for MVP, images are already optimized by designers

## Migration Plan
Not applicable - this is a new feature with no existing implementation to migrate from.

## Open Questions
1. Should we support WebP format? (Defer - PNG/JPG sufficient for now)
2. Should we add keyboard shortcuts for zoom? (Defer - mouse controls sufficient)
3. Should we persist comparison mode preference? (Defer to history feature)
4. Should we add a "Reset" button to clear both images? (Yes - add in polish phase)

## Success Metrics
- Users can upload and compare images in < 10 seconds
- All 3 modes render correctly without cropping
- Zoom controls respond in < 50ms
- Layout transitions complete in 300ms
- Works on screens from 320px to 4K resolution
