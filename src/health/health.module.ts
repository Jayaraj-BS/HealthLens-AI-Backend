/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { LlmModule } from 'src/llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [HealthController],
  providers: [HealthService]
})
export class HealthModule {}
