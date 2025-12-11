# Project Context

## Purpose
Create a web application that allows comparing images from Figma (expected output) and actual implementation images (actual output) to identify UI errors during development. The errors include:
- Layout errors, incorrect positioning, alignment issues
- Color mismatches
- Incorrect size and font size
- Icon mismatches
- Text differences

## System Workflow

### Input
- **Expected Image**: Design image from Figma (can upload file or fetch from Figma URL)
- **Actual Image**: Actual implementation image (file upload)

### Processing Pipeline
1. **Image Preprocessing**: 
   - Resize actual image to match the width of expected image
   - Ensure both images have the same dimensions for accurate comparison
2. **AI Analysis**:
   - Send both images (base64 encoded) to Azure OpenAI API
   - Model analyzes and detects UI differences
3. **Result Processing**:
   - Parse JSON response from AI
   - Extract bug list and bounding box coordinates

### Output
- **Bug List**: List of detected errors, each error includes:
  - `id`: Unique identifier
  - `type`: Error type (LAYOUT_SHIFT, COLOR_MISMATCH, TEXT_DIFFERENCE, ICON_MISMATCH, SIZE_DIFFERENCE)
  - `severity`: Severity level (High, Medium, Low)
  - `description`: Detailed error description
  - `suggestion`: Fix suggestion
  - `bounding_box`: Coordinates [ymin, xmin, ymax, xmax] (normalized 0-1000)
- **Visual Overlays**: Bounding boxes drawn on actual image to highlight error locations

## Tech Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **File Upload**: Multer
- **HTTP Client**: Axios

### AI Integration
- **Provider**: Azure OpenAI
- **Model**: `gpt-4.1-mini` (GPT-4 Vision variant)
- **API**: OpenAI SDK for Node.js
- **Input Format**: Base64 encoded images with high detail
- **Output Format**: Structured JSON with bug details and bounding boxes

### External APIs
- **Figma REST API**: v1 (`/v1/images/{fileId}`)
  - Used to fetch design images directly from Figma URLs
  - Requires `FIGMA_TOKEN` for authentication

## Completed Features

### 1. Manual Comparison (Swipe Mode)
- **2-up Mode**: Side-by-side view with independent zoom controls
- **Swipe Mode**: Interactive slider overlay to drag and view differences
- **Zoom Controls**: 50% - 200% zoom range with 10% increments
- **Responsive Layout**: Sidebar collapse, mobile support

### 2. Figma URL Integration
- **Input Mode Toggle**: Switch between file upload and Figma URL
- **URL Parsing**: Extract file ID and node ID from Figma URL
- **Auto Fetch**: Automatically fetch image from Figma API and load into viewer
- **Error Handling**: Validate URL format and handle API errors

### 3. AI-Powered Comparison
- **Analyze Button**: Trigger AI analysis when both images are uploaded
- **Loading State**: Display progress indicator during analysis
- **Results Panel**: Display bug list with filtering and sorting
- **Error Categorization**: Group bugs by type and severity

### 4. Bounding Box Visualization
- **Visual Overlays**: Draw colored rectangles on actual image
- **Severity-Based Styling**: 
  - High: Red (#ef4444)
  - Medium: Orange (#f97316)
  - Low: Yellow (#eab308)
- **Interactive Selection**: Click to select/deselect bug
- **Toggle Visibility**: Show/hide all overlays with visibility button
- **Coordinate Scaling**: Convert normalized coordinates (0-1000) to actual pixels

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled, prefer type safety over `any`
- **Naming Conventions**:
  - Components: PascalCase (e.g., `BugOverlay`, `ResultsPanel`)
  - Files: kebab-case for CSS (e.g., `BugOverlay.module.css`), camelCase for TS/TSX (e.g., `page.tsx`)
  - Variables/Functions: camelCase (e.g., `handleFileSelect`, `figmaPreview`)
  - CSS Classes: kebab-case (e.g., `sidebar-header`, `upload-box`)
- **Formatting**: 
  - 2 spaces indentation
  - Single quotes for strings in TypeScript
  - Semicolons required
- **React Conventions**:
  - Use functional components with hooks
  - Prefer `const` over `let`
  - Use descriptive state variable names

### Architecture Patterns
- **Frontend (Next.js)**:
  - Client-side rendering with "use client" directive
  - Component-based architecture (BugOverlay, ResultsPanel)
  - State management using React hooks (useState, useRef, useEffect)
  - CSS modules for component-scoped styles
  - Responsive design with mobile-first approach
- **Backend (Express.js)**:
  - RESTful API architecture
  - Route handlers for `/image` and `/compare` endpoints
  - File upload handling with Multer (temp storage in `images/` dir)
  - CORS enabled for all origins (development mode)
- **Communication**:
  - Frontend calls backend via fetch API
  - FormData for multipart file uploads
  - JSON response format
  - Base64 encoding for image transmission to AI

### Testing Strategy
- **Manual Testing**: UI/UX testing for all comparison features
- **Browser Compatibility**: Test on modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive Testing**: Test on different screen sizes (desktop, tablet, mobile)
- **AI Accuracy Testing**: Verify bounding box coordinates and bug detection
- **Error Handling**: Test invalid URLs, large files, network failures

### Git Workflow
- Branch name must be in format: `feat/{feature-name}` or `fix/{fix-name}`
- Commit message must be in format: `feat: {commit-message}` or `fix: {commit-message}` or `chore: {commit-message}`
- Always pull latest changes before creating new branch
- Create PR for code review before merging to main

## Domain Context

### Image Comparison Workflow
1. User uploads/fetches expected image (Figma design)
2. User uploads actual image (implementation screenshot)
3. System auto-resizes actual to match expected width
4. User selects comparison mode (2-up or Swipe)
5. User can zoom in/out for detailed inspection
6. User clicks "Analyze with AI" to detect issues
7. System displays bugs in results panel with bounding boxes

### Comparison Modes
- **2-up Mode**: Side-by-side view for direct comparison
  - Independent zoom controls for each image
  - Scroll to pan when zoomed
  - Bounding boxes overlay on actual image
- **Swipe Mode**: Interactive slider to overlay and compare images
  - Synchronized zoom for both images
  - Draggable divider to reveal more/less of each image
  - Labels showing which image is which

### AI Analysis
- **Model**: Azure OpenAI `gpt-4.1-mini` with vision capabilities
- **Prompt Engineering**: Custom system prompt for UI comparison
- **Detection Categories**: 
  - LAYOUT_SHIFT: Position, alignment, spacing issues
  - COLOR_MISMATCH: Color discrepancies
  - TEXT_DIFFERENCE: Content, font, size differences
  - ICON_MISMATCH: Wrong or missing icons
  - SIZE_DIFFERENCE: Element size discrepancies
- **Severity Levels**: 
  - High: Critical issues affecting functionality
  - Medium: Noticeable issues affecting UX
  - Low: Minor cosmetic issues
- **Bounding Boxes**: Normalized coordinates (0-1000 grid) for precise location

## Important Constraints

### File Constraints
- **File Size Limit**: Maximum 20MB per image upload
- **Image Formats**: PNG, JPG, JPEG supported
- **Validation**: Client-side validation before upload

### API Constraints
- **Azure OpenAI**: Rate limits and token limits apply
- **Figma API**: Rate limits (requires valid FIGMA_TOKEN)
- **Timeout**: 90 seconds for AI analysis requests
- **CORS**: Backend enables CORS for all origins (should restrict in production)

### Performance Considerations
- **Large Images**: May impact comparison speed and AI analysis time
- **Preprocessing**: Resize operation happens client-side before upload
- **Aspect Ratio**: Images maintain aspect ratio, fit-height approach
- **Memory**: Multiple large images may consume significant browser memory

### Browser Requirements
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (ES6+ support)
- **JavaScript**: Must be enabled
- **Canvas API**: Required for image processing
- **Fetch API**: Required for API calls

## External Dependencies

### Azure OpenAI
- **SDK**: `openai` npm package
- **Authentication**: API key from environment variables
- **Model**: `gpt-4.1-mini` (configured via `OPENAI_MODEL` env var)
- **Endpoint**: Configured via Azure OpenAI SDK
- **Input**: Base64 encoded images with `detail: 'high'`
- **Output**: Structured JSON with bug analysis

### Figma API
- **Version**: REST API v1
- **Endpoint**: `https://api.figma.com/v1/images/{fileId}`
- **Authentication**: `X-Figma-Token` header
- **Parameters**: `ids` (node ID), `format` (png)
- **Response**: Image URL from Figma CDN
- **Token**: Stored in `FIGMA_TOKEN` environment variable

### UI Dependencies
- **Google Fonts**: Material Icons for UI icons
- **CSS**: Modern CSS features (Grid, Flexbox, CSS Variables)
- **Material Icons**: 
  - cloud_upload, close, remove, add
  - menu, menu_open, auto_awesome
  - visibility, visibility_off, download, refresh

### Node Packages
- **Frontend**: 
  - `next@16`, `react@19`, `react-dom@19`
  - TypeScript for type safety
- **Backend**: 
  - `express`, `cors`, `multer`, `axios`
  - `openai` for Azure OpenAI integration
  - `dotenv` for environment configuration

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js 16)
- **TypeScript**: For frontend type checking
- **Environment**: `.env` files for configuration

## Environment Variables

### Backend (.env)
```env
# Azure OpenAI Configuration
OPENAI_API_KEY=your_azure_openai_api_key
OPENAI_MODEL=gpt-4.1-mini

# Figma Integration
FIGMA_TOKEN=your_figma_personal_access_token

# AI Prompt
FIGMA_COMPARE_PROMPT=your_custom_comparison_prompt

# Server Configuration
PORT=3001
NODE_ENV=dev
```

### Frontend (optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
