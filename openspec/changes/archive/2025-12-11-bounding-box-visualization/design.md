# Design: Bounding Box Visualization

## Component Architecture

### BugOverlay Component
A React component that renders bounding boxes over the actual implementation image.

**Props:**
- `bugs: Bug[]` - Array of detected issues with bounding box coordinates
- `selectedBugId: number | null` - Currently selected bug ID
- `onBugSelect: (bugId: number | null) => void` - Callback when a bug is selected
- `visible: boolean` - Whether overlays are visible
- `imageRef: React.RefObject<HTMLImageElement>` - Reference to the image element

**Rendering Logic:**
1. Get natural image dimensions from imageRef
2. Calculate scale factors: `scaleX = naturalWidth / 1000`, `scaleY = naturalHeight / 1000`
3. For each bug with valid bounding_box `[ymin, xmin, ymax, xmax]`:
   - Clamp coordinates to 0-1000 range
   - Convert to pixels: `top = ymin * scaleY`, `left = xmin * scaleX`, etc.
   - Render colored div with absolute positioning
4. Apply severity-based styling (red/orange/yellow borders)
5. Show badge with bug ID when selected

## Visual Design

### Color Scheme
- **High Severity**: Red border (#ef4444), semi-transparent red background
- **Medium Severity**: Orange border (#f97316), semi-transparent orange background  
- **Low Severity**: Yellow border (#eab308), semi-transparent yellow background

### Interactive States
- **Default**: 2px border, 10% opacity background
- **Hover**: Increased opacity (20%), cursor pointer
- **Selected**: Thicker border (3px), 30% opacity, show badge

### Toggle Button
- Icon: Material Icons `visibility` / `visibility_off`
- Position: In mode selector bar, after "Analyze with AI" button
- Only visible when there are valid bounding boxes to display

## Coordinate System
- Backend returns normalized coordinates in format: `[ymin, xmin, ymax, xmax]`
- Coordinates are in 0-1000 range (normalized to 1000x1000 grid)
- Frontend scales to actual image dimensions using natural width/height
- Handles edge cases: flipped coordinates, out-of-bounds values

## Integration Points
- Overlays render inside the actual implementation image wrapper in 2-up mode
- Positioned absolutely relative to the scaled image container
- Z-index ensures overlays appear above image but below UI controls
- Clicking an overlay updates `selectedBugId` state, which highlights the corresponding issue in ResultsPanel
