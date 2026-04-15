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
}