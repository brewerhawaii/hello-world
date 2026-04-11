import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Post('events')
  events(@Body() dto: any) {
    return this.service.events(dto);
  }

  @Post('dashboard')
  dashboard(@Body() dto: any) {
    return this.service.dashboard(dto);
  }
}
