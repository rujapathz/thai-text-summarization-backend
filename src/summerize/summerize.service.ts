// src/summerize/summerize.service.ts
import { Injectable } from '@nestjs/common';
import { TextSummarizeDto } from './dto/summarize.dto';


@Injectable()
export class SummerizeService {
  summarizeText(dto: TextSummarizeDto): { summary: string; original_text: string } {
    const { text, min_length, max_length } = dto;

    // ── Stub logic (จะแทนด้วย ML model ทีหลัง) ──
    const sentences = text.split(/(?<=[.!?।\n])\s+/).filter(s => s.trim().length > 0);
    const keepCount = Math.max(1, Math.ceil(sentences.length * 0.3));
    const summary = sentences.slice(0, keepCount).join(' ').trim();

    return {
      summary: summary || text.slice(0, max_length ?? 300),
      original_text: text,
    };
  }
}