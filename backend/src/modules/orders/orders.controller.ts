import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post(':id/items')
  addItems(@Param('id') id: string, @Body() dto: any) {
    return this.service.addItems(id, dto);
  }
}
