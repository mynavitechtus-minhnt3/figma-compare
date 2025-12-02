# Figma Compare - AI-Powered UI Comparison Tool

Compare Figma designs with actual implementations using AI to automatically detect UI discrepancies.

## Features

- 📸 **Image Upload**: Upload Figma design and actual implementation screenshots
- 🔍 **Comparison Modes**: 
  - 2-up: Side-by-side comparison
  - Swipe: Interactive slider overlay
- 🔎 **Zoom Controls**: Zoom from 50% to 200% for detailed inspection
- 🤖 **AI Analysis**: Powered by Google Gemini AI to detect:
  - Layout issues
  - Color discrepancies
  - Text differences
  - Icon mismatches
  - Size/spacing problems

## Tech Stack

### Backend (NestJS)
- NestJS framework
- Google Generative AI SDK
- Multer for file uploads
- TypeScript

### Frontend (Next.js)
- Next.js 16 with Turbopack
- React 19
- TypeScript
- CSS Modules

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API Key

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

4. Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

5. Start development server:
```bash
npm run start:dev
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

1. Open `http://localhost:3000` in your browser
2. Upload two images:
   - **Figma Design**: The expected design from Figma
   - **Actual Implementation**: Screenshot of the actual implementation
3. Choose comparison mode (2-up or Swipe)
4. Click **"Analyze with AI"** button
5. View AI-generated analysis results showing:
   - Issue type (Layout, Color, Text, Icon, Size)
   - Severity level (High, Medium, Low)
   - Description of the issue
   - Suggestion for fixing

## File Constraints

- **Max file size**: 20MB per image
- **Supported formats**: PNG, JPG, JPEG

## Project Structure

```
figma-compare/
├── figma-compare-be/          # Backend (NestJS)
│   ├── src/
│   │   ├── compare/           # Comparison endpoints
│   │   ├── gemini/            # AI service
│   │   └── main.ts            # Entry point
│   └── .env.example           # Environment template
│
├── figma-compare-web/         # Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx           # Main page
│   │   ├── constants.ts       # Configuration constants
│   │   └── globals.css        # Global styles
│   └── public/                # Static assets
│
└── openspec/                  # OpenSpec documentation
```

## API Endpoints

### POST /compare/ai
Analyze two images using AI

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `files`: Array of 2 image files

**Response:**
```json
{
  "issues": [
    {
      "type": "Layout|Color|Text|Icon|Size",
      "severity": "High|Medium|Low",
      "description": "Description of the issue",
      "suggestion": "How to fix it"
    }
  ]
}
```

## Development

### Backend
```bash
cd figma-compare-be
npm run start:dev    # Development with watch mode
npm run build        # Production build
npm run start:prod   # Production server
```

### Frontend
```bash
cd figma-compare-web
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
```

## Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

### Frontend (optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## License

UNLICENSED
