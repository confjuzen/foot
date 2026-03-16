import { Controller, Get } from '@nestjs/common';
import type { PlayerWithRating } from '../performance/performance.entity';
import { InMemoryDataService } from '../data/in-memory-data.service';

@Controller('players')
export class PlayerStatsController {
  constructor(private readonly dataService: InMemoryDataService) {}

  @Get('stats')
  getPlayersWithStats(): PlayerWithRating[] {
    return this.dataService.getAllPlayersWithAverageRating();
  }
}
