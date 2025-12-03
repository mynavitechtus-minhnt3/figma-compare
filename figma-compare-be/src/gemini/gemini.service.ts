import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async analyzeImages(figmaImageBuffer: Buffer, actualImageBuffer: Buffer) {
    const prompt = `# ROLE
You are an expert AI QA Automation Engineer and UI/UX Auditor. Your task is to perform "Visual Regression Testing" by comparing a "Reference Image" (Figma Design) with an "Actual Image" (Production Screenshot).

# OBJECTIVE
Detect "Visual Drift" and bugs (Layout, Style, Content) by analyzing the visual hierarchy. Output strictly JSON.

# INPUT CONTEXT
- Platform: Web Application
- Data Context: Reference Image uses mock data. Actual Image uses real API data.

# COMPARISON LOGIC (CHAIN OF THOUGHT)
Perform this analysis internally:

1. **Visual Hierarchy & Segmentation:**
   - Scan for Visual Containers: Fixed Layers (Nav/Tab bars), Scrollable Content (Lists, Cards), and Overlays.
   - Establish a coordinate mapping between the two images based on these containers.

2. **Element Classification:**
   - **System UI (Mobile):** Status Bar (Battery, Time), Home Indicator (Ignore these).
   - **Static UI:** Labels, Buttons, Icons, Branding Elements (Must Match).
   - **Dynamic Zones:** User-generated content, API values (Flexible).

3. **Discrepancy Analysis (The "Visual Drift" Check):**
   - **Input Field Logic (State Mismatch):**
     - IF Design shows Placeholder (e.g., "Enter text") AND Actual shows Typed Value (e.g., "John Doe" or masked password \`******\`) -> **IGNORE** (This is a valid state change: Empty -> Filled).
     - IF Design shows Placeholder AND Actual is Empty but missing the placeholder -> REPORT BUG.
     - Verify the **Label** (outside the box) matches exactly.
   - **Missing/Extra Elements:** Are there elements in Design missing in Build? Or debug elements left in Build? -> REPORT BUG.
   - **Typography Check:** Compare Font Family, Size, and Weight.
   - **Accessibility Check:** Check for low contrast text.
   - **Static Text:** If UI labels differ (e.g., "Login" vs "Sign In") -> REPORT BUG.
   - **System/OS Areas:** ALWAYS IGNORE differences in Mobile Status Bars.

# SEVERITY LEVELS
- **Critical:** Functional blockers (Crash, Overlapping text, Button unclickable), Missing Elements.
- **Major:** Typography mismatch (Wrong font/weight), Color contrast failure (Accessibility), Misalignment > 10px, Safe Area Violation.
- **Minor:** Subtle spacing/padding issues (< 5px), Minor color shade difference.

# OUTPUT FORMAT
Return ONLY a raw JSON object (no markdown, no backticks).
Coordinate format: \`[ymin, xmin, ymax, xmax]\` (Normalized 0-1000 scale).

{
  "analysis_log": "Summarize the visual drift found and how you filtered dynamic data.",
  "is_pass": boolean,
  "total_bugs": integer,
  "bugs": [
    {
      "id": integer,
      "type": "Layout" | "Typography" | "Color_Accessibility" | "Content_Mismatch" | "Missing_Extra_Element" | "Safe_Area_Violation",
      "severity": "Critical" | "Major" | "Minor",
      "description": "Concise description.",
      "bounding_box": [ymin, xmin, ymax, xmax]
    }
  ]
}`;

    const imageParts = [
      this.bufferToGenerativePart(figmaImageBuffer, 'image/png'), // Assuming PNG for now, can be dynamic
      this.bufferToGenerativePart(actualImageBuffer, 'image/png'),
    ];

    try {
      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      // Clean up potential markdown code blocks
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Error analyzing images:', error);
      throw new Error('Failed to analyze images with AI');
    }
  }

  private bufferToGenerativePart(buffer: Buffer, mimeType: string) {
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType,
      },
    };
  }
}
