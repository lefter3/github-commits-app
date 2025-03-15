import { Module } from '@nestjs/common';
import { GithubApiService } from './github-api.service';
import { GithubApiController } from './github-api.controller';

@Module({
  providers: [GithubApiService],
  controllers: [GithubApiController],
})
export class GithubApiModule {}
