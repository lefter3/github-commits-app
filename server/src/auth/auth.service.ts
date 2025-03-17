import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

      constructor(
        private readonly userService: UsersService,
        private readonly jwt: JwtService,
        private readonly configService: ConfigService,
      ) {}

      
      
}
