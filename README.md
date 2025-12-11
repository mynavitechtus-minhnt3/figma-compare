# Figma Compare - AI-Powered UI Comparison Tool

Compare Figma designs with actual implementations using AI to automatically detect UI discrepancies.

## Features

- 📸 **Image Upload**: Upload Figma design and actual implementation screenshots
- 🔗 **Figma URL Integration**: Fetch design images directly from Figma URLs
- 🔍 **Comparison Modes**: 
  - 2-up: Side-by-side comparison with independent zoom
  - Swipe: Interactive slider overlay
- 🔎 **Zoom Controls**: Zoom from 50% to 200% for detailed inspection
- 🤖 **AI Analysis**: Powered by Azure OpenAI (GPT-4.1-mini) to detect:
  - Layout shifts and alignment issues
  - Color discrepancies
  - Text differences
  - Icon mismatches
  - Size/spacing problems
- 🎯 **Visual Bounding Boxes**: Highlight exact location of issues on the actual image
- 📊 **Severity Levels**: Issues categorized as High, Medium, or Low

## Tech Stack

### Backend (Express.js)
- Express.js framework
- Azure OpenAI SDK (gpt-4.1-mini)
- Multer for file uploads
- Axios for HTTP requests
- JavaScript (ES6+)

### Frontend (Next.js)
- Next.js 16 with Turbopack
- React 19
- TypeScript
- CSS Modules
- Material Icons

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Azure OpenAI API Key
- Figma Personal Access Token (optional, for Figma URL feature)

### Backend Setup

1. Navigate to backend directory:
```bash
cd figma-compare-be
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
# Azure OpenAI Configuration
OPENAI_API_KEY=your_azure_openai_api_key
OPENAI_MODEL=gpt-4.1-mini

# Figma Integration (optional)
FIGMA_TOKEN=your_figma_personal_access_token

# AI Prompt
FIGMA_COMPARE_PROMPT=your_custom_comparison_prompt

# Server Configuration
PORT=3001
NODE_ENV=dev
```

5. Start development server:
```bash
node index.js
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd figma-compare-web
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

### Basic Workflow

1. Open `http://localhost:3000` in your browser
2. Upload/fetch two images:
   - **Figma Design**: 
     - Upload a file, OR
     - Switch to "Figma URL" mode and paste Figma design URL
   - **Actual Implementation**: Upload screenshot of actual implementation
3. Images are automatically resized to match width
4. Choose comparison mode (2-up or Swipe)
5. Use zoom controls for detailed inspection
6. Click **"Analyze with AI"** button
7. View AI-generated analysis results showing:
   - Issue type (LAYOUT_SHIFT, COLOR_MISMATCH, TEXT_DIFFERENCE, ICON_MISMATCH, SIZE_DIFFERENCE)
   - Severity level (High, Medium, Low)
   - Description of the issue
   - Suggestion for fixing
   - Bounding box coordinates
8. Click on bounding boxes or result items to highlight specific issues
9. Toggle overlay visibility with the "Overlays" button

### Figma URL Format

To fetch images from Figma, use URLs in this format:
```
https://www.figma.com/design/{fileId}/...?node-id={nodeId}
```

Example:
```
https://www.figma.com/design/abc123xyz/My-Design?node-id=123-456
```

## File Constraints

- **Max file size**: 20MB per image
- **Supported formats**: PNG, JPG, JPEG

## Project Structure

```
figma-compare/
├── figma-compare-be/          # Backend (Express.js)
│   ├── index.js               # Main server file
│   ├── images/                # Temp upload directory
│   └── .env                   # Environment variables
│
├── figma-compare-web/         # Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx           # Main comparison page
│   │   ├── components/        # React components
│   │   │   ├── BugOverlay/    # Bounding box visualization
│   │   │   └── ResultsPanel/  # AI results display
│   │   ├── lib/               # Utilities
│   │   │   ├── api.ts         # API client functions
│   │   │   └── imageUtils.ts  # Image processing
│   │   ├── constants.ts       # Configuration
│   │   └── globals.css        # Global styles
│   └── public/                # Static assets
│
└── openspec/                  # OpenSpec documentation
    ├── specs/                 # Feature specifications
    │   ├── ai-comparison/
    │   ├── bounding-box-visualization/
    │   ├── figma-image-fetching/
    │   └── image-comparison/
    └── changes/archive/       # Archived change proposals
```

## API Endpoints

### GET /image
Fetch image from Figma URL

**Request:**
- Query Parameters:
  - `url`: Figma design URL

**Response:**
```json
{
  "error": null,
  "image": "https://figma-cdn.com/..."
}
```

### POST /compare
Analyze two images using AI

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `expected`: Expected image file (Figma design)
  - `actual`: Actual image file (implementation)

**Response:**
```json
{
  "data": {
    "bugs": [
      {
        "id": 1,
        "type": "LAYOUT_SHIFT",
        "severity": "High",
        "description": "Description of the issue",
        "suggestion": "How to fix it",
        "bounding_box": [ymin, xmin, ymax, xmax]
      }
    ]
  }
}
```

**Bounding Box Format:**
- Coordinates are normalized to 0-1000 range
- Format: `[ymin, xmin, ymax, xmax]`
- Frontend scales to actual image dimensions

## Development

### Backend
```bash
cd figma-compare-be
node index.js           # Start server
```

### Frontend
```bash
cd figma-compare-web
npm run dev             # Development server
npm run build           # Production build
npm run start           # Production server
```

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

## How It Works

### Image Preprocessing
1. User uploads/fetches expected image (Figma design)
2. User uploads actual image (implementation)
3. Frontend automatically resizes actual image to match expected width
4. Both images are prepared for comparison

### AI Analysis Pipeline
1. Both images are converted to base64 format
2. Sent to Azure OpenAI API with custom comparison prompt
3. GPT-4.1-mini analyzes images with vision capabilities
4. AI returns structured JSON with detected issues and bounding boxes
5. Frontend parses response and displays results

### Bounding Box Visualization
1. AI returns normalized coordinates (0-1000 grid)
2. Frontend scales coordinates to actual image dimensions
3. Colored rectangles overlay the actual image
4. Colors indicate severity: Red (High), Orange (Medium), Yellow (Low)
5. Interactive: click to select, toggle visibility

## Documentation

For detailed specifications and architecture, see the [OpenSpec documentation](./openspec/README.md).

## License

UNLICENSED
