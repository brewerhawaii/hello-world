import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecommendationEngineService } from './recommendation-engine.service';

@Controller('recommendation-engine')
export class RecommendationEngineController {
  constructor(private readonly service: RecommendationEngineService) {}

  @Post('generate')
  generate(@Body() dto: any) {
    return this.service.generate(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }
}
