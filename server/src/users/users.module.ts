import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { GithubApiModule } from 'src/github-api/github-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), GithubApiModule],
  providers: [UsersService],
})
export class UsersModule {}
