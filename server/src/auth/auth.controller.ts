import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor() {}

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
