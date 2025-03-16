import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/dto/request.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('github'))
  async login() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  authCallback(@Req() req: AuthRequest) {
    console.log(req.user);
    this.userService.afterGithubLogin(req.user); // await?
    return {
      token: this.jwt.sign(req.user),
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: AuthRequest) {
    return req.user;
  }
}
