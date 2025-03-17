import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { COUNT_COMMITS_QUEUE_NAME } from 'src/config/constants';
import { CountCommitsWorker } from './count-commits.worker';
import { CommitCountModule } from 'src/commit-count/commit-count.module';
import { GithubApiModule } from 'src/github-api/github-api.module';

@Module({
  imports: [
    CommitCountModule,
    GithubApiModule,
    BullModule.registerQueue({
      name: COUNT_COMMITS_QUEUE_NAME,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
  ],
  providers: [CountCommitsWorker],
  exports: [],
})
export class CommitCountQueue {}
