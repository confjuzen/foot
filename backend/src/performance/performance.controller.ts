import { Controller, Post, Body, Param, Get, BadRequestException, NotFoundException } from '@nestjs/common';
import type { Performance, CreatePerformanceDto } from './performance.entity';
import { InMemoryDataService } from '../data/in-memory-data.service';

@Controller('matches/:matchId/performances')
export class PerformanceController {
  constructor(private readonly dataService: InMemoryDataService) {}

  @Post()
  createPerformance(
    @Param('matchId') matchId: string,
    @Body() createPerformanceDto: CreatePerformanceDto,
  ): Performance {
    const parsedMatchId = Number(matchId);
    if (!Number.isFinite(parsedMatchId)) {
      throw new BadRequestException('matchId must be a number');
    }

    const match = this.dataService.getMatchById(parsedMatchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const player = this.dataService.getPlayerById(createPerformanceDto.playerId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const existing = this.dataService
      .getPerformancesByMatchId(parsedMatchId)
      .some((perf) => perf.playerId === createPerformanceDto.playerId);
    if (existing) {
      throw new BadRequestException('Performance already exists for this player in this match');
    }

    if (!Number.isFinite(createPerformanceDto.goals) || createPerformanceDto.goals < 0) {
      throw new BadRequestException('goals must be a non-negative number');
    }
    if (!Number.isFinite(createPerformanceDto.assists) || createPerformanceDto.assists < 0) {
      throw new BadRequestException('assists must be a non-negative number');
    }
    if (!Number.isFinite(createPerformanceDto.rating) || createPerformanceDto.rating < 0 || createPerformanceDto.rating > 10) {
      throw new BadRequestException('rating must be between 0 and 10');
    }

    return this.dataService.createPerformance(createPerformanceDto, parsedMatchId);
  }

  @Get()
  getPerformancesByMatch(@Param('matchId') matchId: string): Performance[] {
    return this.dataService.getPerformancesByMatchId(Number(matchId));
  }
}

@Controller('performances')
export class PerformancesController {
  constructor(private readonly dataService: InMemoryDataService) {}

  @Get()
  getPerformances(): Performance[] {
    return this.dataService.getPerformances();
  }
}
