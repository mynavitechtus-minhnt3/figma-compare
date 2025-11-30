import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFiles 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import axios from 'axios';

@Controller('compare')
export class CompareController {

  @Post()
  @UseInterceptors(FilesInterceptor('files', 2))
  async compare(@UploadedFiles() files: Express.Multer.File[]) {

    if (!files || files.length < 2) {
      return { error: 'You must upload 2 files: expected and actual' };
    }

    // files[0] = expected
    // files[1] = actual
    const expectedFile = files[0];
    const actualFile = files[1];

    const expectedBase64 = expectedFile.buffer.toString('base64');
    const actualBase64 = actualFile.buffer.toString('base64');

    const API_KEY = 'AIzaSyAtN-7UA1Z5N6u7rYWJV2ViJgpiT8wfmbo';
    const model = 'gemini-2.5-flash';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `
Compare these two UI images. Return STRICT JSON ONLY:

{
  "summary": "...",
  "overall_match_score": 0-100,
  "issues": [
    {
      "type": "text|color|layout|spacing|size|missing|extra|other",
      "description": "...",
      "severity": "low|medium|high"
    }
  ]
}
`
            },
            {
              inline_data: {
                mime_type: expectedFile.mimetype || 'image/png',
                data: expectedBase64
              }
            },
            {
              inline_data: {
                mime_type: actualFile.mimetype || 'image/png',
                data: actualBase64
              }
            }
          ]
        }
      ]
    };

    const res = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    let text =
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Remove ```json and ``` if the model accidentally wraps output
    text = text.replace(/```json/g, '').replace(/```/g, '');

    try {
      return JSON.parse(text);
    } catch (err) {
      return {
        error: 'Model returned invalid JSON',
        raw: text
      };
    }
  }
}
