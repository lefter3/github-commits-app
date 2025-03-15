import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(jwt: JwtService) {}

  @Get()
  @UseGuards(AuthGuard('github'))
  async login() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  authCallback(@Req() req) {
    return req.user;
    // add user & sign token
  }
}
