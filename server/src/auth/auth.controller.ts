import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/dto/request.dto';
import { UserCreatedEvent } from 'src/events/user-created.event';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwt: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @UseGuards(AuthGuard('github'))
  async login() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  authCallback(@Req() req: AuthRequest) {
    this.eventEmitter.emit(UserCreatedEvent.name, new UserCreatedEvent(req.user.token, req.user.username))
    return {
      token: this.jwt.sign(req.user),
      name: req.user.displayName,
      username: req.user.username,
    };
  }

  @Get('callback/web')
  webCallback(@Query() code: string){
    
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
