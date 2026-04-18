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
<<<<<<< HEAD

  @Post('evaluate-url')
  evaluateUrl(@Body() dto: any) {
    return this.summerizeService.evaluateUrl(dto);
  }

  @Post('evaluate-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async evaluatePdf(
    @UploadedFile() file: Express.Multer.File,
    @Body('mode') mode: string,
    @Body('reference') reference: string,
  ) {
    return this.summerizeService.evaluatePdf(file, mode, reference);
  }
=======
>>>>>>> 54b967da7be5392c51e47814f1808fd27f3beaf2
}
