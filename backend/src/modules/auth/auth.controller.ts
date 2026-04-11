import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('device-login')
  device_login(@Body() dto: any) {
    return this.service.device_login(dto);
  }

  @Post('login')
  login(@Body() dto: any) {
    return this.service.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: any) {
    return this.service.refresh(dto);
  }

  @Post('logout')
  logout(@Body() dto: any) {
    return this.service.logout(dto);
  }
}
