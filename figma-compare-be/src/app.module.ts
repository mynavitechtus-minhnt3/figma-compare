import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompareModule } from './compare/compare.module';

@Module({
  imports: [CompareModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
