import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFiles 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GeminiService } from '../gemini/gemini.service';

@Controller('compare')
export class CompareController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('ai')
  @UseInterceptors(FilesInterceptor('files', 2))
  async analyze(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length < 2) {
      return { error: 'You must upload 2 files: expected and actual' };
    }

    const expectedFile = files[0];
    const actualFile = files[1];

    return this.geminiService.analyzeImages(expectedFile.buffer, actualFile.buffer);
  }

  // Legacy endpoint - redirects to new AI endpoint
  @Post()
  @UseInterceptors(FilesInterceptor('files', 2))
  async compare(@UploadedFiles() files: Express.Multer.File[]) {
    return this.analyze(files);
  }
}
