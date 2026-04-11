import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post('slots')
  slots(@Body() dto: any) {
    return this.service.slots(dto);
  }

  @Get()
  list() {
    return this.service.list();
  }
}
