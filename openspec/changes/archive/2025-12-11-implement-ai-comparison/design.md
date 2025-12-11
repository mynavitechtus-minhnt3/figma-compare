# Design: AI Image Comparison Architecture

## Overview
The AI comparison feature involves sending two images to the backend, which then forwards them to the Google Gemini API with a specific prompt to identify discrepancies. The results are parsed and returned to the frontend for display.

## Architecture

### Frontend (Next.js)
- **UI Components**:
  - `AICompareButton`: A button to trigger the analysis.
  - `AIAnalysisResult`: A component to display the list of issues found by AI.
  - `IssueOverlay`: (Optional for this iteration) Visual markers on the images.
- **State Management**:
  - Store analysis status (idle, loading, success, error).
  - Store the list of detected issues.

### Backend (NestJS)
- **Controller**: `CompareController` (existing or new `AIController`)
  - Endpoint: `POST /compare/ai`
  - Accepts: Two image files (multipart/form-data).
- **Service**: `GeminiService`
  - Handles authentication with Google Gemini API.
  - Constructs the prompt.
  - Sends images and prompt to the model.
  - Parses the JSON response from Gemini.

## Data Flow
1. User uploads two images and clicks "Analyze with AI".
2. Frontend sends images to `POST /compare/ai`.
3. Backend receives images.
4. Backend calls `GeminiService.analyze(image1, image2)`.
5. `GeminiService` sends request to Gemini API.
6. Gemini API returns text/JSON analysis.
7. Backend parses response and returns structured data (list of issues).
8. Frontend displays the issues.

## API Interface

### Request
`POST /compare/ai`
Content-Type: `multipart/form-data`
Body:
- `figma_image`: File
- `actual_image`: File

### Response
```json
{
  "issues": [
    {
      "type": "layout" | "color" | "text" | "icon" | "size",
      "severity": "high" | "medium" | "low",
      "description": "The button alignment is off by 5px.",
      "suggestion": "Move the button to the right."
    }
  ]
}
```

## Prompt Engineering
The prompt needs to be carefully crafted to get structured JSON output.
Example:
"Analyze these two images. The first is the design (Figma), the second is the implementation. Identify UI discrepancies in layout, color, text, icons, and size. Return the result as a JSON array of objects with fields: type, severity, description, suggestion."
