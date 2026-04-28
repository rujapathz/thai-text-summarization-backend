import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { TextSummarizeDto, UrlSummarizeDto } from './dto/summarize.dto';

@Injectable()
export class SummerizeService {
  constructor(private readonly httpService: HttpService) {}

calculateFrontendScore(
  original: string,
  summary: string,
  mode: 'teaser' | 'short' | 'normal'
) {
  
  const originalLength = original.length || 1;
  const summaryLength = summary.length || 0;

  const ratio = summaryLength / originalLength;

  
  let min = 0.2, max = 0.5;

  if (mode === 'teaser') {
    min = 0.1; max = 0.25;
  } else if (mode === 'short') {
    min = 0.15; max = 0.4;
  } else if (mode === 'normal') {
    min = 0.3; max = 0.7;
  }

  // 🔹 Length Score 
  let lengthScore = 0;
  if (ratio >= min && ratio <= max) {
    lengthScore = 100;
  } else if (ratio < min) {
    lengthScore = 65;
  } else if (ratio <= max * 1.3) {
    lengthScore = 75;
  } else {
    lengthScore = 50;
  }

  
  let matchCount = 0;
  for (let i = 0; i < summary.length; i++) {
    if (original.includes(summary[i])) {
      matchCount++;
    }
  }

  let contentScore =
    summaryLength > 0
      ? (matchCount / summaryLength) * 100
      : 0;

  
  if (contentScore === 0 && summaryLength > 0) {
    contentScore = 20;
  }

  
  const uniqueChars = new Set(summary);
  const redundancyScore =
    summaryLength > 0
      ? (uniqueChars.size / summaryLength) * 100
      : 0;

  // 🔹 Final score 
  const finalScore = Math.round(
    lengthScore * 0.4 +
    contentScore * 0.4 +
    redundancyScore * 0.2
  );

  return {
    score: finalScore
  };
}
  // 🔹 TEXT
  async summarizeText(dto: TextSummarizeDto) {
    const { text, mode } = dto;

    try {
      const response = await firstValueFrom(
        this.httpService.post('http://host.docker.internal:8000/summarize', {
          text,
          mode,
        }),
      );

      const summary = response.data.summary;

      const metric = this.calculateFrontendScore(text, summary, mode);

      return {
        summary,
        original_text: text,
        frontend_metric: metric, 
      };

    } catch (error) {
      return {
        summary: 'ERROR: model service not available',
        original_text: text,
        frontend_metric: null,
      };
    }
  }

  // 🔹 URL
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
        .slice(0, 1000);

      const response = await firstValueFrom(
        this.httpService.post('http://host.docker.internal:8000/summarize', {
          text: cleanText,
          mode,
        }),
      );

      const summary = response.data.summary;
      const metric = this.calculateFrontendScore(cleanText, summary, mode);

      return {
        summary,
        original_text: cleanText,
        frontend_metric: metric, 
      };

    } catch (error) {
      return {
        summary: 'ERROR: cannot fetch or summarize URL',
        original_text: url,
        frontend_metric: null,
      };
    }
  }

    // 🔹 PDF
  async summarizePdf(file: any, mode: string) {
    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(file.buffer);

      let text = data.text;

      const cleanText = text
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1000);

      const finalMode = (mode || 'normal') as 'normal' | 'teaser' | 'short';

      const response = await firstValueFrom(
        this.httpService.post('http://host.docker.internal:8000/summarize', {
          text: cleanText,
          mode : finalMode,
        }),
      );

      const summary = response.data.summary;
      const metric = this.calculateFrontendScore(cleanText, summary, finalMode);

      return {
        summary,
        original_text: cleanText,
        frontend_metric: metric,
      };

    } catch (error) {
      console.error(error);
      return {
        summary: 'ERROR: cannot parse or summarize PDF',
        original_text: '',
        frontend_metric: null,
      };
    }
  }

  // 🔹 BERTScore 
  async summarizeWithBertScore(dto: TextSummarizeDto) {
    const { text, mode, reference } = dto;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://host.docker.internal:8000/evaluate',
          { text, mode, reference },
          { timeout: 60000 }
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

async evaluateUrl(dto: UrlSummarizeDto & { reference?: string }) {
  const { url, mode, reference } = dto;

  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(res.data);

    $('script, style, nav, footer, header, aside').remove();

    let content = $('article').text();
    if (!content) content = $('main').text();
    if (!content) content = $('body').text();

    const cleanText = content
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1000);

    
    if (!cleanText || cleanText.length < 50) {
      return {
        summary: 'ERROR: cannot extract content from URL',
        bertscore: null,
        original_text: url,
      };
    }

    const response = await firstValueFrom(
      this.httpService.post(
        'http://host.docker.internal:8000/evaluate',
        {
          text: cleanText,
          mode,
          reference,
        },
        { timeout: 300000 }
      )
    );

    return {
      summary: response.data.summary,
      bertscore: response.data.bertscore,
      original_text: cleanText,
    };

  } catch (error) {
    console.error(
      'ERROR:',
      (error as any)?.response?.data || (error as any)?.message
    );

    return {
      summary: 'ERROR: evaluate-url failed',
      bertscore: null,
      original_text: url,
    };
  }
}

  async evaluatePdf(file: any, mode: string, reference?: string) {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(file.buffer);

    let text = data.text;

    const cleanText = text
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1000);

    const response = await firstValueFrom(
      this.httpService.post(
        'http://host.docker.internal:8000/evaluate',
        {
          text: cleanText,
          mode,
          reference,
        },
        { timeout: 60000 }
      )
    );

    return {
      summary: response.data.summary,
      bertscore: response.data.bertscore,
      original_text: cleanText,
    };

  } catch (error) {
    console.error(error);
    return {
      summary: 'ERROR',
      bertscore: null,
      original_text: '',
    };
  }
}
}