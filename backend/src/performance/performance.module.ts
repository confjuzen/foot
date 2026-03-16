import { Module } from '@nestjs/common';
import { PerformanceController, PerformancesController } from './performance.controller';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [PerformanceController, PerformancesController],
})
export class PerformanceModule {}
