import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { TokenPayload } from 'src/dto/request.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') ?? '',
      callbackURL: 'http://localhost:3000/auth/callback',
      scope: ['repo']
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): TokenPayload {
    if (!profile.username) {
      throw new Error('Invalid profile');
    }
    return {
      username: profile.username,
      ghToken: accessToken,
      displayName: profile.displayName,
    };
  }
}
