import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor(configService: ConfigService) {
    super({
        passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() ?? '',
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  validate(payload: any) {
    return { id: payload.sub, username: payload.username };
  }
}