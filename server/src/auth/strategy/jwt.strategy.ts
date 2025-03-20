import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from 'src/dto/request.dto';
import { Octokit } from '@octokit/rest';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() ?? '',
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(payload: TokenPayload) {
    // check gh token
    const octokit = new Octokit({
      auth: payload.token,
    });
    const user = await octokit.rest.users.getAuthenticated();
    if (!user.data || payload.username !== user.data.login) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
