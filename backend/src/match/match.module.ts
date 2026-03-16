import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [MatchController],
})
export class MatchModule {}
