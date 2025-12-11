# bounding-box-visualization Specification

## Purpose
Provide visual overlays on the actual implementation image to highlight the exact location of AI-detected UI issues. Bounding boxes are color-coded by severity, interactive for selection, and can be toggled on/off for better visibility during comparison.
## Requirements
### Requirement: Visual Bug Indicators
The system SHALL display visual overlays on the actual implementation image to indicate the location of detected issues.

#### Scenario: Bounding box rendering
- **WHEN** AI analysis completes with detected issues
- **THEN** colored bounding boxes SHALL be overlaid on the actual implementation image
- **AND** each box SHALL correspond to one detected issue

#### Scenario: Coordinate scaling
- **WHEN** rendering bounding boxes
- **THEN** normalized coordinates (0-1000) SHALL be scaled to match actual image dimensions
- **AND** boxes SHALL accurately highlight the issue location

#### Scenario: No bounding boxes
- **WHEN** AI analysis returns issues without valid bounding box coordinates
- **THEN** no overlays SHALL be displayed
- **AND** the toggle button SHALL not be visible

### Requirement: Severity-Based Styling
The system SHALL visually distinguish issues by severity level using color coding.

#### Scenario: High severity styling
- **WHEN** an issue has severity "High"
- **THEN** its bounding box SHALL have a red border (#ef4444)
- **AND** a semi-transparent red background

#### Scenario: Medium severity styling
- **WHEN** an issue has severity "Medium"
- **THEN** its bounding box SHALL have an orange border (#f97316)
- **AND** a semi-transparent orange background

#### Scenario: Low severity styling
- **WHEN** an issue has severity "Low"
- **THEN** its bounding box SHALL have a yellow border (#eab308)
- **AND** a semi-transparent yellow background

### Requirement: Interactive Overlays
The system SHALL allow users to interact with bounding box overlays.

#### Scenario: Hover state
- **WHEN** user hovers over a bounding box
- **THEN** the box opacity SHALL increase
- **AND** cursor SHALL change to pointer

#### Scenario: Selection
- **WHEN** user clicks a bounding box
- **THEN** the box SHALL be highlighted with a thicker border
- **AND** a badge with the issue ID SHALL be displayed
- **AND** the corresponding issue SHALL be highlighted in the results panel

#### Scenario: Deselection
- **WHEN** user clicks a selected bounding box
- **THEN** the selection SHALL be cleared
- **AND** the box SHALL return to default styling

### Requirement: Overlay Visibility Control
The system SHALL provide a toggle to show/hide all bounding box overlays.

#### Scenario: Toggle button visibility
- **WHEN** AI analysis returns at least one issue with valid bounding box coordinates
- **THEN** an "Overlays" toggle button SHALL be displayed in the mode selector

#### Scenario: Hide overlays
- **WHEN** user clicks the toggle button while overlays are visible
- **THEN** all bounding boxes SHALL be hidden
- **AND** the button icon SHALL change to "visibility_off"

#### Scenario: Show overlays
- **WHEN** user clicks the toggle button while overlays are hidden
- **THEN** all bounding boxes SHALL be displayed
- **AND** the button icon SHALL change to "visibility"

### Requirement: Coordinate Validation
The system SHALL validate and handle invalid bounding box coordinates gracefully.

#### Scenario: Invalid format
- **WHEN** a bounding box is not an array of 4 numbers
- **THEN** that overlay SHALL not be rendered
- **AND** no error SHALL be shown to the user

#### Scenario: Out of bounds coordinates
- **WHEN** bounding box coordinates are outside the 0-1000 range
- **THEN** coordinates SHALL be clamped to valid range
- **AND** the overlay SHALL still be rendered

#### Scenario: Flipped coordinates
- **WHEN** min coordinates are greater than max coordinates
- **THEN** the system SHALL use Math.min/Math.max to correct them
- **AND** the overlay SHALL render correctly

