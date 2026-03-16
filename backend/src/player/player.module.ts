import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerStatsController } from './player-stats.controller';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [PlayerController, PlayerStatsController],
})
export class PlayerModule {}
