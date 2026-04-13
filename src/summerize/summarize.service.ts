import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TextSummarizeDto } from './dto/summarize.dto';

@Injectable()
export class SummerizeService {
  constructor(private readonly httpService: HttpService) {}

  async summarizeText(dto: TextSummarizeDto) {
    const { text, mode } = dto;

    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/summarize', {
          text,
          mode,
        }),
      );

      return {
        summary: response.data.summary,
        original_text: text,
      };

    } catch (error) {
      return {
        summary: 'ERROR: model service not available',
        original_text: text,
      };
    }
  }
}