import { Controller, Get, Post, Body, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import type { Player, CreatePlayerDto } from './player.entity';
import type { Performance } from '../performance/performance.entity';
import { InMemoryDataService } from '../data/in-memory-data.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly dataService: InMemoryDataService) {}

  @Get()
  getPlayers(): Player[] {
    return this.dataService.getPlayers();
  }

  @Post()
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): Player {
    return this.dataService.createPlayer(createPlayerDto);
  }

  @Get(':id/performances')
  getPerformancesByPlayerId(@Param('id') id: string): Performance[] {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      throw new BadRequestException('playerId must be a number');
    }

    const player = this.dataService.getPlayerById(parsedId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return this.dataService.getPerformancesByPlayerId(parsedId);
  }
}
