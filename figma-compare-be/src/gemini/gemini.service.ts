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
    const prompt = `
      Analyze these two images. The first image is the Figma design (expected), and the second image is the actual implementation.
      Identify UI discrepancies in the following categories: Layout, Color, Text, Icon, Size.
      
      Return the result as a JSON object with a key "issues" which is an array of objects.
      Each object should have:
      - "type": one of "Layout", "Color", "Text", "Icon", "Size"
      - "severity": "High", "Medium", or "Low"
      - "description": A brief description of the issue.
      - "suggestion": A suggestion on how to fix it.
      
      If no issues are found, return { "issues": [] }.
      Do not include markdown formatting (like \`\`\`json). Just return the raw JSON string.
    `;

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
