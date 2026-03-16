import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './data/data.module';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [DataModule, PlayerModule, MatchModule, PerformanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
