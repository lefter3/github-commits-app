import { Controller, Get, Query, Redirect, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/dto/request.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwt: JwtService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('github'))
  async login() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  @Redirect()
  async authCallback(@Req() req: AuthRequest, @Query() code, @Res() res) {
    const isUserStored = await this.authService.storeUser({
      token: req.user.token,
      username: req.user.username,
      code,
      displayName: req.user.displayName,
    });
    if (isUserStored) res.redirect(`/?code=${code}`);
    throw new UnauthorizedException()
  }

  @Get('me')
  getMe(@Query() code ) {
    return this.authService.exchangeCodeForToken(code)
  }
}
