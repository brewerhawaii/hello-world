import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuestionnairesService } from './questionnaires.service';

@Controller('questionnaires')
export class QuestionnairesController {
  constructor(private readonly service: QuestionnairesService) {}

  @Get('active')
  active(@Body() dto: any) {
    return this.service.active(dto);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() dto: any) {
    return this.service.submit(id, dto);
  }
}
