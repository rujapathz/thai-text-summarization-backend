import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SummerizeService } from './summarize.service';
import { TextSummarizeDto } from './dto/summarize.dto';

@Controller('summarize')
export class SummerizeController {
  constructor(private readonly summerizeService: SummerizeService) {}

  @Post('text')
  summarizeText(@Body() dto: TextSummarizeDto) {
    return this.summerizeService.summarizeText(dto);
  }
}