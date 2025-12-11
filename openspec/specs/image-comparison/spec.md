# image-comparison Specification

## Purpose
Provide a comprehensive image comparison viewer that allows users to upload, view, and compare two images (Figma design vs. actual implementation) using multiple comparison modes (2-up side-by-side and swipe overlay) with zoom controls and responsive layout.
## Requirements
### Requirement: File Upload
The system SHALL allow users to upload two images for comparison via click or drag-and-drop.

#### Scenario: Upload via click
- **WHEN** user clicks on an upload box
- **THEN** a file dialog SHALL open allowing selection of PNG or JPG files

#### Scenario: Upload via drag-and-drop
- **WHEN** user drags an image file over an upload box
- **THEN** the box SHALL show a hover state
- **AND** dropping the file SHALL upload it

#### Scenario: File type validation
- **WHEN** user attempts to upload a non-image file
- **THEN** the system SHALL reject the file and show an error message

#### Scenario: File size validation
- **WHEN** user attempts to upload a file larger than 20MB
- **THEN** the system SHALL reject the file and show an error message

#### Scenario: Image preview
- **WHEN** a valid image is uploaded
- **THEN** a thumbnail preview SHALL be displayed in the upload box
- **AND** a remove button SHALL appear to clear the image

### Requirement: 2-up Comparison Mode
The system SHALL display both images side-by-side with independent zoom controls.

#### Scenario: Side-by-side display
- **WHEN** both images are uploaded and 2-up mode is selected
- **THEN** images SHALL be displayed in two equal columns
- **AND** each image SHALL fit within its container height without cropping

#### Scenario: Independent zoom controls
- **WHEN** user adjusts zoom for one image in 2-up mode
- **THEN** only that image SHALL zoom
- **AND** the other image SHALL remain at its current zoom level

#### Scenario: Scroll for zoomed images
- **WHEN** an image is zoomed beyond container size
- **THEN** scroll bars SHALL appear to allow panning

### Requirement: Swipe Comparison Mode
The system SHALL overlay images with a draggable divider for comparison.

#### Scenario: Overlay display
- **WHEN** both images are uploaded and Swipe mode is selected
- **THEN** images SHALL be overlaid with one clipped by a vertical divider

#### Scenario: Draggable divider
- **WHEN** user drags the divider left or right
- **THEN** the clip region SHALL update in real-time
- **AND** more or less of each image SHALL be revealed

#### Scenario: Synchronized zoom
- **WHEN** user adjusts zoom in Swipe mode
- **THEN** both images SHALL zoom together maintaining alignment

### Requirement: Zoom Controls
The system SHALL provide zoom controls for detailed inspection of images.

#### Scenario: Zoom range
- **WHEN** zoom controls are displayed
- **THEN** users SHALL be able to zoom from 50% to 200%

#### Scenario: Zoom in
- **WHEN** user clicks zoom in button
- **THEN** zoom level SHALL increase by 10%
- **AND** button SHALL be disabled when at 200%

#### Scenario: Zoom out
- **WHEN** user clicks zoom out button
- **THEN** zoom level SHALL decrease by 10%
- **AND** button SHALL be disabled when at 50%

#### Scenario: Zoom percentage display
- **WHEN** zoom level changes
- **THEN** current percentage SHALL be displayed between zoom buttons

### Requirement: Fit-Height Display
The system SHALL display images at their full resolution without cropping.

#### Scenario: Full image visibility
- **WHEN** images are displayed in any mode
- **THEN** the entire image content SHALL be visible within the viewport
- **AND** images SHALL maintain their aspect ratio

#### Scenario: Container adaptation
- **WHEN** images have different aspect ratios
- **THEN** each image SHALL fit within its container height
- **AND** width SHALL adjust automatically to maintain aspect ratio

### Requirement: Responsive Layout
The system SHALL adapt the layout based on available images and screen size.

#### Scenario: Sidebar collapse
- **WHEN** both images are uploaded
- **THEN** the sidebar SHALL collapse from 320px to 180px
- **AND** the viewer area SHALL expand to maximize comparison space

#### Scenario: Mobile layout
- **WHEN** screen width is below 768px
- **THEN** the sidebar SHALL stack above the viewer
- **AND** comparison modes SHALL remain functional

#### Scenario: Smooth transitions
- **WHEN** layout changes occur
- **THEN** all size changes SHALL animate smoothly over 0.3 seconds

### Requirement: Mode Selection
The system SHALL allow users to switch between comparison modes.

#### Scenario: Mode selector display
- **WHEN** both images are uploaded
- **THEN** mode selector buttons SHALL appear at the bottom of the viewer
- **AND** the active mode SHALL be visually highlighted
- **AND** only "2-up" and "Swipe" modes SHALL be available

#### Scenario: Mode switching
- **WHEN** user clicks a different mode button
- **THEN** the viewer SHALL switch to that mode
- **AND** the previous mode's state (zoom, position) SHALL be reset

### Requirement: Visual Design
The system SHALL provide a modern, professional interface with dark mode support.

#### Scenario: Dark mode styling
- **WHEN** user's system is in dark mode
- **THEN** the interface SHALL use dark backgrounds and light text
- **AND** all controls SHALL remain clearly visible

#### Scenario: Material Design icons
- **WHEN** UI elements require icons
- **THEN** Material Icons SHALL be used for consistency

#### Scenario: Hover effects
- **WHEN** user hovers over interactive elements
- **THEN** visual feedback SHALL be provided (color change, scale, etc.)

