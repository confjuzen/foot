import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import type { Match, CreateMatchDto } from './match.entity';
import { InMemoryDataService } from '../data/in-memory-data.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly dataService: InMemoryDataService) {}

  @Get()
  getMatches(): Match[] {
    return this.dataService.getMatches();
  }

  @Post()
  createMatch(@Body() createMatchDto: CreateMatchDto): Match {
    return this.dataService.createMatch(createMatchDto);
  }

  @Get(':id')
  getMatchById(@Param('id') id: string): Match | undefined {
    return this.dataService.getMatchById(Number(id));
  }
}
