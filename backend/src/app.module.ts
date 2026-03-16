import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataModule } from './data/data.module';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [DataModule, PlayerModule, MatchModule, PerformanceModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
