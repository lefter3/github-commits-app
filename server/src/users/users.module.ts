import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { GithubApiModule } from 'src/github-api/github-api.module';
import { BullModule } from '@nestjs/bullmq';
import { COUNT_COMMITS_QUEUE_NAME } from 'src/config/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    GithubApiModule,
    BullModule.registerQueue({
      name: COUNT_COMMITS_QUEUE_NAME,
    }),
  ],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
