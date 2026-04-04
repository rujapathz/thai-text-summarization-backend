import { Controller, Get, Post } from '@nestjs/common';
import { SummerizeService } from './summerize.service';

@Controller('summerize')
export class SummerizeController {
  constructor(private readonly summerizeService: SummerizeService) {}

  @Get()
  findAll(): string[] {  
    return this.summerizeService.findAll();  
  }

  @Post()
  create(): string {
    return this.summerizeService.create(); 
  }
}