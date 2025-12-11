# Figma Compare - OpenSpec Documentation

## Overview
This directory contains the OpenSpec documentation for the Figma Compare project - an AI-powered UI comparison tool that helps developers identify discrepancies between Figma designs and actual implementations.

## Features Documented

### 1. Image Comparison (`image-comparison`)
**Purpose**: Provide a comprehensive image comparison viewer with multiple modes and zoom controls.

**Key Requirements** (8 total):
- File Upload (drag-and-drop, click to upload, validation)
- 2-up Comparison Mode (side-by-side with independent zoom)
- Swipe Comparison Mode (overlay with draggable divider)
- Zoom Controls (50%-200% range)
- Fit-Height Display (maintain aspect ratio)
- Responsive Layout (sidebar collapse, mobile support)
- Mode Selection (toggle between modes)
- Visual Design (dark mode, Material Icons, hover effects)

### 2. AI Comparison (`ai-comparison`)
**Purpose**: Enable automated AI-powered analysis of UI discrepancies using Google Gemini API.

**Key Requirements** (3 total):
- AI Analysis Trigger (button, loading state)
- AI Analysis Results (display issues, error handling)
- Issue Categorization (by type and severity)

**Issue Types**: Layout, Color, Text, Icon, Size  
**Severity Levels**: High, Medium, Low

### 3. Bounding Box Visualization (`bounding-box-visualization`)
**Purpose**: Provide visual overlays to highlight the exact location of AI-detected issues.

**Key Requirements** (5 total):
- Visual Bug Indicators (colored overlays on image)
- Severity-Based Styling (red/orange/yellow color coding)
- Interactive Overlays (hover, selection, badges)
- Overlay Visibility Control (toggle show/hide)
- Coordinate Validation (handle invalid/out-of-bounds coordinates)

**Coordinate System**: Normalized 0-1000 grid, scaled to actual image dimensions

### 4. Figma Image Fetching (`figma-image-fetching`)
**Purpose**: Streamline workflow by fetching images directly from Figma URLs.

**Key Requirements** (8 total):
- Input Mode Selection (toggle between file upload and URL)
- Figma URL Input (text field, fetch button, Enter key support)
- URL Fetching Process (loading state, success/error handling)
- URL Parsing and Validation (extract file ID and node ID)
- Figma API Integration (authenticate, fetch image URL)
- Image Download from CDN (fetch and convert to File)
- Image Resizing Integration (auto-resize to match)
- Environment Configuration (FIGMA_TOKEN required)

**API Integration**: Figma REST API v1 (`/v1/images/{fileId}`)

## Architecture

### Frontend (Next.js)
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Key Components**:
  - `page.tsx` - Main comparison interface
  - `BugOverlay` - Bounding box visualization
  - `ResultsPanel` - AI analysis results display
  - `lib/api.ts` - API client functions
  - `lib/imageUtils.ts` - Image processing utilities

### Backend (Express.js)
- **Framework**: Express.js
- **Language**: JavaScript (Node.js)
- **Key Endpoints**:
  - `GET /image` - Fetch image from Figma URL
  - `POST /compare` - AI-powered image comparison
- **AI Integration**: Azure OpenAI (GPT-4 Vision)
- **External APIs**: Figma REST API

## Directory Structure

```
openspec/
├── specs/                          # Main specifications
│   ├── ai-comparison/
│   │   └── spec.md                # AI comparison requirements
│   ├── bounding-box-visualization/
│   │   └── spec.md                # Bounding box requirements
│   ├── figma-image-fetching/
│   │   └── spec.md                # Figma integration requirements
│   └── image-comparison/
│       └── spec.md                # Image viewer requirements
│
├── changes/                        # Change history
│   └── archive/                   # Archived changes
│       ├── 2025-11-30-add-image-comparison-viewer/
│       ├── 2025-11-30-update-comparison-features/
│       ├── 2025-12-11-implement-ai-comparison/
│       ├── 2025-12-11-bounding-box-visualization/
│       └── 2025-12-11-figma-image-fetching/
│
├── project.md                      # Project configuration
└── AGENTS.md                       # Agent instructions
```

## Archived Changes

Each archived change contains:
- `proposal.md` - Problem statement and solution approach
- `design.md` - Technical design and architecture
- `tasks.md` - Implementation checklist (all marked complete)
- `specs/{feature}/spec.md` - Feature requirements (delta format)

### Change History
1. **2025-11-30-add-image-comparison-viewer** - Initial image comparison viewer
2. **2025-11-30-update-comparison-features** - Enhanced comparison modes
3. **2025-12-11-implement-ai-comparison** - AI-powered analysis
4. **2025-12-11-bounding-box-visualization** - Visual issue indicators
5. **2025-12-11-figma-image-fetching** - Direct Figma integration

## Requirements Summary

| Feature | Requirements | Scenarios |
|---------|-------------|-----------|
| Image Comparison | 8 | 25+ |
| AI Comparison | 3 | 7 |
| Bounding Box Visualization | 5 | 13 |
| Figma Image Fetching | 8 | 20+ |
| **Total** | **24** | **65+** |

## Usage

### Validate All Specs
```bash
openspec validate --strict
```

### List All Specs
```bash
openspec list --specs
```

### View Specific Spec
```bash
openspec show ai-comparison
```

### View Dashboard
```bash
openspec view
```

## Environment Requirements

### Backend
- `FIGMA_TOKEN` - Figma personal access token (required for image fetching)
- `OPENAI_API_KEY` - Azure OpenAI API key (required for AI comparison)
- `OPENAI_MODEL` - Model name (e.g., `gpt-4-vision-preview`)
- `FIGMA_COMPARE_PROMPT` - System prompt for AI comparison

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3001`)

## Key Workflows

### Image Comparison Workflow
1. User uploads/fetches Figma design image
2. User uploads actual implementation screenshot
3. Images are auto-resized to match width
4. User selects comparison mode (2-up or Swipe)
5. User can zoom in/out for detailed inspection

### AI Analysis Workflow
1. User clicks "Analyze with AI" button
2. Both images sent to backend
3. Backend calls Azure OpenAI with custom prompt
4. AI returns structured JSON with detected issues
5. Frontend displays issues in ResultsPanel
6. Bounding boxes overlay actual image
7. User can click boxes to see issue details

### Figma Integration Workflow
1. User switches to "Figma URL" mode
2. User pastes Figma design URL
3. Backend parses URL to extract file ID and node ID
4. Backend calls Figma API to get image URL
5. Frontend fetches image from Figma CDN
6. Image loaded into comparison viewer

## Reusability

This OpenSpec documentation can be reused for:
- **Similar Projects**: Any image comparison or visual regression testing tool
- **Feature Extensions**: Adding new comparison modes, AI models, or integrations
- **Training**: Teaching new team members about the system architecture
- **Maintenance**: Understanding requirements when fixing bugs or adding features
- **Migration**: Porting to different frameworks or platforms

## Validation Status

All specs pass strict validation:
- ✓ `spec/ai-comparison`
- ✓ `spec/bounding-box-visualization`
- ✓ `spec/figma-image-fetching`
- ✓ `spec/image-comparison`

Last validated: 2025-12-11
