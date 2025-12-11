# Proposal: Bounding Box Visualization

## Why
Users need to quickly identify the exact location of UI discrepancies detected by AI analysis. Without visual indicators, users must manually search for issues described in text, which is time-consuming and error-prone.

## What Changes
Add visual bounding box overlays on the actual implementation image to highlight the exact location of each detected issue. The overlays will be color-coded by severity and interactive, allowing users to click to see more details.

## Context
After AI analysis completes, the backend returns bounding box coordinates for each detected issue. These coordinates are normalized to a 1000x1000 grid and need to be scaled to match the actual image dimensions. The frontend will render these as colored rectangles overlaid on the image.

## Solution
- Create a `BugOverlay` component that renders bounding boxes over the actual implementation image
- Scale normalized coordinates (0-1000) to actual image pixel dimensions
- Color-code boxes by severity: High (red), Medium (orange), Low (yellow)
- Make boxes interactive - clicking selects/deselects the issue
- Add a toggle button to show/hide all overlays
- Display issue ID badge when a box is selected

## Risks
- **Coordinate Accuracy**: AI-generated coordinates may not be perfectly accurate
- **Performance**: Rendering many overlays could impact performance
- **Overlap**: Multiple overlays in the same area might be hard to distinguish
