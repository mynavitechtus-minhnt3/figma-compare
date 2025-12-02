## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Onion Skin Comparison Mode
**Reason**: Feature is rarely used and complicates the UI.
**Migration**: Users should use Swipe mode for pixel-perfect alignment checks.
