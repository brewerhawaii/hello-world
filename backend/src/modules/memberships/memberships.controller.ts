import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MembershipsService } from './memberships.service';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly service: MembershipsService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
