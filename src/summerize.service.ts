import { Injectable } from '@nestjs/common';

@Injectable()
export class SummerizeService {
  private readonly summaryData: string[] = ['Summary 1', 'Summary 2', 'Summary 3'];

  getSummary(): string {
    return 'This is the summary data';
  }

  findAll(): string[] {
    return this.summaryData;
  }

  create(): string {
    return 'Data created successfully';
  }
}