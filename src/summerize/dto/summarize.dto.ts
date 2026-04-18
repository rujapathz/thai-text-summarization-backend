// src/summerize/dto/summerize.dto.ts
import { IsString, IsNumber, IsIn, IsOptional, Min, Max } from 'class-validator';

export class TextSummarizeDto {
  @IsString()
  text: string;

  @IsString()
  @IsIn(['teaser', 'short', 'normal'])
  mode: 'teaser' | 'short' | 'normal';

  @IsOptional()         
  @IsString()
  reference?: string; 
}

export class UrlSummarizeDto {
  @IsString()
  url: string;

  @IsString()
  @IsIn(['teaser', 'short', 'normal'])
  mode: 'teaser' | 'short' | 'normal';
}

export class PdfSummarizeDto {
  @IsString()
  @IsIn(['teaser', 'short', 'normal'])
  mode: 'teaser' | 'short' | 'normal';
}
//   @IsNumber()
//   @IsOptional()
//   ratio?: number = 0.3;

//   @IsNumber()
//   @IsOptional()
//   min_length?: number = 30;

//   @IsNumber()
//   @IsOptional()
//   max_length?: number = 300;