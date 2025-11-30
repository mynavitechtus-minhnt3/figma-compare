# Change: Add Image Comparison Viewer with Multiple Display Modes

## Why
Developers need an efficient tool to compare UI implementations against Figma designs to identify visual discrepancies. Currently, there's no easy way to:
- Upload and view two images side-by-side
- Overlay images to spot subtle differences
- Zoom in to inspect fine details
- Switch between different comparison modes for different use cases

## What Changes
- Add file upload functionality (click and drag-and-drop)
- Implement three comparison modes:
  - **2-up**: Side-by-side view with independent zoom controls
  - **Swipe**: Overlay with draggable divider
  - **Onion Skin**: Overlay with opacity control
- Add zoom controls (50%-200%) for all modes
- Implement fit-height display to show full image content without cropping
- Create responsive layout that adapts when images are loaded
- Support PNG and JPG formats up to 10MB

## Impact
- **Affected specs**: 
  - New capability: `image-comparison` (upload, display, zoom, comparison modes)
- **Affected code**:
  - Frontend: `app/page.tsx` - Main comparison component
  - Frontend: `app/globals.css` - Styling for all modes and controls
  - Frontend: New state management for files, previews, zoom levels
- **Breaking changes**: None (new feature)

## Dependencies
- Material Icons (Google Fonts) for UI icons
- Roboto font (Google Fonts) for typography
- Browser FileReader API for image preview
- Browser localStorage API (future: for history)

## Rollout Plan
1. Implement file upload with preview
2. Add 2-up comparison mode
3. Add Swipe mode with draggable divider
4. Add Onion Skin mode with opacity slider
5. Implement zoom controls for all modes
6. Optimize layout responsiveness
7. Test across browsers and devices

## Acceptance Criteria

### File Upload
- [ ] Users can click upload box to select PNG or JPG files
- [ ] Users can drag and drop image files onto upload boxes
- [ ] Files larger than 10MB are rejected with clear error message
- [ ] Non-image files are rejected with clear error message
- [ ] Uploaded images show thumbnail preview
- [ ] Remove button clears uploaded image and resets upload box

### 2-up Comparison Mode
- [ ] Both images display side-by-side in equal columns
- [ ] Each image shows full content without cropping (fit-height)
- [ ] Independent zoom controls work for each image (50%-200%)
- [ ] Zoom in/out buttons respond correctly
- [ ] Zoom percentage displays accurately
- [ ] Scroll bars appear when image is zoomed beyond container
- [ ] Images maintain aspect ratio at all zoom levels

### Swipe Comparison Mode
- [ ] Images overlay with vertical divider in center
- [ ] Divider can be dragged smoothly left and right
- [ ] Image reveal updates in real-time during drag
- [ ] Zoom controls affect both images simultaneously
- [ ] Images remain aligned when zoomed
- [ ] Divider handle is clearly visible and clickable

### Onion Skin Comparison Mode
- [ ] Actual image overlays Figma image
- [ ] Opacity slider controls top image transparency (0-100%)
- [ ] Opacity changes are smooth and real-time
- [ ] Zoom controls affect both images simultaneously
- [ ] Images remain aligned when zoomed
- [ ] Opacity control is clearly visible and accessible

### Zoom Functionality
- [ ] Zoom range is enforced (50% minimum, 200% maximum)
- [ ] Zoom in button disabled at 200%
- [ ] Zoom out button disabled at 50%
- [ ] Zoom increments by 10% per click
- [ ] Current zoom percentage displays correctly
- [ ] Transform origin is set to top center for natural zooming
- [ ] Zoom controls are compact and minimally intrusive

### Responsive Layout
- [ ] Sidebar is 320px wide by default
- [ ] Sidebar collapses to 180px when both images are loaded
- [ ] Viewer area expands (3x) when images are loaded
- [ ] All transitions are smooth (300ms)
- [ ] Layout works on mobile devices (< 768px width)
- [ ] On mobile, sidebar stacks above viewer
- [ ] All functionality remains accessible on mobile

### Mode Selection
- [ ] Three mode buttons are visible when images are loaded
- [ ] Active mode is clearly highlighted
- [ ] Clicking a mode button switches the view
- [ ] Mode switching is instant and smooth
- [ ] All modes work correctly after switching

### Visual Design
- [ ] Material Icons load and display correctly
- [ ] Roboto font loads and applies to all text
- [ ] Dark mode styling applies when system preference is dark
- [ ] Light mode styling applies when system preference is light
- [ ] All interactive elements have hover effects
- [ ] Upload boxes show hover state on drag-over
- [ ] Empty state shows placeholder image with instructions

### Performance
- [ ] File upload and preview complete in < 2 seconds
- [ ] Mode switching completes in < 100ms
- [ ] Zoom operations respond in < 50ms
- [ ] Slider/divider drag is smooth with no lag
- [ ] Layout transitions complete in 300ms
- [ ] No memory leaks when uploading multiple images

### Browser Compatibility
- [ ] Works on Chrome (latest)
- [ ] Works on Firefox (latest)
- [ ] Works on Safari (latest)
- [ ] Works on Edge (latest)
- [ ] Drag-and-drop works on all browsers
- [ ] All CSS features render correctly

### Accessibility
- [ ] Upload boxes have proper ARIA labels
- [ ] Buttons have descriptive labels
- [ ] Keyboard navigation works for mode selection
- [ ] Focus indicators are visible
- [ ] Images have appropriate alt text
- [ ] Color contrast meets WCAG AA standards
