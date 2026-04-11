import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post(':id/score')
  score(@Param('id') id: string) {
    return this.service.score(id);
  }

  @Post(':id/route')
  route(@Param('id') id: string) {
    return this.service.route(id);
  }
}
