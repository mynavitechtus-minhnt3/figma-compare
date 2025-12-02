import { Module } from '@nestjs/common';
import { CompareController } from './compare.controller';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [CompareController],
})
export class CompareModule {}
