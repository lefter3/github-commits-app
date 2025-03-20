import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreUserDto } from 'src/dto/auth.dto';
import { TokenPayload } from 'src/dto/request.dto';
import { Tokens } from 'src/entities/tokens.entity';
import { User } from 'src/entities/users.entity';
import { UserStoredEvent } from 'src/events/user-created.event';
import { getYMDFormat } from 'src/util/utils';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tokens)
    private readonly tokenRepository: Repository<Tokens>,
  ) {}

  createAppToken(payload: TokenPayload) {
    return this.jwtService.sign(payload);
  }

  async storeUser(payload: StoreUserDto): Promise<boolean> {
    const { token, username, code } = payload;
    let since: string | null = null;
    try {
      const user = await this.userRepository.findOneBy({ username });
      if (!user) {
        await this.userRepository.insert({
          username,
          lastLogin: getYMDFormat(),
        });
      } else {
        since = getYMDFormat(user.lastLogin);
        await this.userRepository.update(user.id, { lastLogin: since });
      }

      this.eventEmitter.emit(UserStoredEvent.name, {
        token,
        username,
        since, // get last commit stored
      });
    } catch (error) {
      console.error(error);
      return false;
      // throw new HttpException("User was not ")
    }

    const appToken = this.createAppToken({
      token: payload.token,
      username: payload.username,
      displayName: payload.displayName,
    });
    await this.tokenRepository.insert({
      token: appToken,
      code,
    });
    return true;
    // transaction?
  }

  async exchangeCodeForToken(code: string): Promise<TokenPayload> {
    const entry = await this.tokenRepository.findOneBy({ code });
    if (!entry) throw new UnauthorizedException();
    this.tokenRepository.delete({ code }).catch((err) => console.log(err));
    const payload: TokenPayload = this.jwtService.decode(entry.token);
    return {
      token: entry.token,
      displayName: payload.displayName ?? '',
      username: payload.username,
    };
  }
}
