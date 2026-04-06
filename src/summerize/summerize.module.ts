import { Module } from '@nestjs/common';
import { SummerizeController } from './summerize.controller';
import { SummerizeService } from './summerize.service';

@Module({
  controllers: [SummerizeController],
  providers: [SummerizeService],
})
export class SummerizeModule {}