import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('stripe/intent')
  stripe_intent(@Body() dto: any) {
    return this.service.stripe_intent(dto);
  }

  @Post('stripe/webhook')
  stripe_webhook(@Body() dto: any) {
    return this.service.stripe_webhook(dto);
  }
}
