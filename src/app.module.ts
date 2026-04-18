// src/app.module.ts
import { Module } from '@nestjs/common';
import { SummerizeModule } from '@summerize/summarize.module';


@Module({
  imports: [SummerizeModule],
})
export class AppModule {}