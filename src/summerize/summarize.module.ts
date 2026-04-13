import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SummerizeController } from './summarize.controller';
import { SummerizeService } from './summarize.service';

@Module({
  imports: [HttpModule],
  controllers: [SummerizeController],
  providers: [SummerizeService],
})
export class SummerizeModule {}