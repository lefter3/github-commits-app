import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
import { Octokit } from '@octokit/rest';
import { TokenPayload } from 'src/dto/request.dto';
import { Tokens } from 'src/entities/tokens.entity';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private githubAuth;
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private readonly tokenRepository: Repository<Tokens>,
  ) {
    this.githubAuth = createOAuthAppAuth({
      clientType: 'oauth-app',
      clientId: this.configService.getOrThrow('GITHUB_CLIENT_ID'),
      clientSecret: this.configService.getOrThrow('GITHUB_CLIENT_SECRET'),
    });
  }

  async exchangeCodeForToken(code: string): Promise<TokenPayload> {
    const user = await this.githubAuth({
      type: 'oauth-user',
      code,
    });
    if (!user?.token) {
      throw new BadRequestException('Code is invalid');
    }
    const token = user.token;
    const octokit = new Octokit({
      auth: token,
    });

    const { data: userData } = await octokit.users.getAuthenticated();
    this.eventEmitter.emit(
      UserCreatedEvent.name,
      new UserCreatedEvent(user.token, userData.login),
    );

    return {
      token: this.jwtService.sign({
        token,
        username: userData.login,
        displayName: userData.name,
      }),
      username: userData.login,
      displayName: userData.name ?? "",
    };
  }
}
