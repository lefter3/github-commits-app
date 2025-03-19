import { BadRequestException, Controller, Get, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/dto/request.dto';
import { AuthService } from './auth.service';

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
  async authCallback(@Req() req: AuthRequest, @Query('code') code, @Res() res) {
    const isUserStored = await this.authService.storeUser({
      token: req.user.token,
      username: req.user.username,
      code,
      displayName: req.user.displayName,
    });
    if (isUserStored) {
      return res.redirect(`/?code=${code}`);
    }
    throw new UnauthorizedException()
  }

  @Get('token')
  getToken(@Query('code') code: string ) {
    if (!code) throw new BadRequestException()
    return this.authService.exchangeCodeForToken(code)
  }
  
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: AuthRequest) {
    return {
      name: req.user.displayName,
      username: req.user.username,
    }
    }
}
