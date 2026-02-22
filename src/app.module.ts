/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { LlmModule } from './llm/llm.module';
import { LlmService } from './llm/llm.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule, LlmModule],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService, LlmService],
})
export class AppModule { }
