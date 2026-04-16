import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { TextSummarizeDto, UrlSummarizeDto } from './dto/summarize.dto';

@Injectable()
export class SummerizeService {
  constructor(private readonly httpService: HttpService) {}

  async summarizeText(dto: TextSummarizeDto) {
    const { text, mode } = dto;

    try {
      const response = await firstValueFrom(
        this.httpService.post('http://host.docker.internal:8000/summarize', {
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

  async summarizeUrl(dto: UrlSummarizeDto) {
    const { url, mode } = dto;

    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);

      $('script, style, nav, footer, header').remove();

      let content = $('article').text();

      if (!content) content = $('main').text();
      if (!content) content = $('body').text();

      const cleanText = content
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 2000);

      const response = await firstValueFrom(
        this.httpService.post('http://host.docker.internal:8000/summarize', {
          text: cleanText,
          mode,
        }),
      );

      return {
        summary: response.data.summary,
        original_text: cleanText,
      };

    } catch (error) {
      return {
        summary: 'ERROR: cannot fetch or summarize URL',
        original_text: url,
      };
    }
  }

  async summarizeWithBertScore(dto: TextSummarizeDto) {
  const { text, mode, reference } = dto;

  try {
    const response = await firstValueFrom(
      this.httpService.post(
        'http://127.0.0.1:8000/evaluate',
        {
          text,
          mode,
          reference,
        },
        { timeout: 300000 }
      )
    );

    return {
      summary: response.data.summary,
      bertscore: response.data.bertscore,
      original_text: text,
    };

  } catch (error) {
    console.error(
  '🔥 ERROR:',
  (error as any)?.response?.data || (error as any)?.message
);

    return {
      summary: 'ERROR',
      bertscore: null,
      original_text: text,
    };
  }
}
  async summarizePdf(file: any, mode: string) {
    try {
      const pdfParse = require('pdf-parse');
      
      const data = await pdfParse(file.buffer);
      
      let text = data.text;
      console.log('PDF TEXT:', text);
      const cleanText = text
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 2000);

      const finalMode = mode || 'normal';

      const response = await firstValueFrom(
        this.httpService.post('http://host.docker.internal:8000/summarize', {
          text: cleanText,
          mode: finalMode,
        }),
      );

      return {
        summary: response.data.summary,
        original_text: cleanText,
      };

    } catch (error) {
      console.error(error);
      return {
        summary: 'ERROR: cannot parse or summarize PDF',
        original_text: '',
      };
    }
  }
}