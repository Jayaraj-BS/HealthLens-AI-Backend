/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {

  constructor(private healthService: HealthService) { }

  @Post('lifestyle-risk')
  analyzeLifestyle(@Body() body: any) {
    return this.healthService.analyzeLifestyle(body);
  }

  @Post('simplify-report')
  simplifyReport(@Body() body: any) {
    return this.healthService.simplifyReport(body);
  }

}
