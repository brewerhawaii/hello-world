import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { KiosksService } from './kiosks.service';

@Controller('kiosks')
export class KiosksController {
  constructor(private readonly service: KiosksService) {}

  @Get(':id/health')
  health(@Param('id') id: string) {
    return this.service.health(id);
  }

  @Post(':id/refresh-content')
  refresh(@Param('id') id: string) {
    return this.service.refreshContent(id);
  }
}
