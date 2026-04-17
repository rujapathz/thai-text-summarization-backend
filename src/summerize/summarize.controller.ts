import { Controller, Post, Body, HttpCode, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { SummerizeService } from './summarize.service';
import { PdfSummarizeDto, TextSummarizeDto, UrlSummarizeDto } from './dto/summarize.dto';

@Controller('summarize')
export class SummerizeController {
  constructor(private readonly summerizeService: SummerizeService) {}

  @Post('text')
  summarizeText(@Body() dto: TextSummarizeDto) {
    return this.summerizeService.summarizeText(dto);
  }

  @Post('url')
  summarizeUrl(@Body() dto: UrlSummarizeDto) {
    return this.summerizeService.summarizeUrl(dto);
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async summarizePdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PdfSummarizeDto,
  ) {
    return this.summerizeService.summarizePdf(file, dto.mode);
  }

  @Post('evaluate')
  summarizeWithBert(@Body() dto: TextSummarizeDto) {
    return this.summerizeService.summarizeWithBertScore(dto);
  }
}
