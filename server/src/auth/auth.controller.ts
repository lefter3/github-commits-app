import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/dto/request.dto';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwt: JwtService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('github'))
  async login(@Query() code) {
    // return this.authService.githubAuthorize()
  }


  @Get('callback')
  // @UseGuards(AuthGuard('github'))
  authCallback(@Req() req: AuthRequest, @Query() code) {
    return code
    // return {
    //   token: this.jwt.sign(req.user),
    //   name: req.user.displayName,
    //   username: req.user.username,
    // };
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
