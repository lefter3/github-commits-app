import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CommitCountService } from 'src/commit-count/commit-count.service';
import { COUNT_COMMITS_QUEUE_NAME } from 'src/config/constants';
import { CommitCountDto, CountCommitsJob } from 'src/dto/countCommits.dto';
import { GithubApiService } from 'src/github-api/github-api.service';
import { getYMDFormat, isDateToday } from 'src/util/utils';

@Processor(COUNT_COMMITS_QUEUE_NAME)
export class CountCommitsWorker extends WorkerHost {
  constructor(
    private readonly githubApiService: GithubApiService,
    private readonly commitCountService: CommitCountService,
  ) {
    super();
  }
  async process(job: Job<CountCommitsJob>) {
    console.log('Counting commits for', job.data);
    const commitCounts: { [key: string]: number } = {};
    const newCounts: CommitCountDto[] = [];
    const iterator = this.githubApiService.getUserCommitsForRepo(job.data);
    // group commits by date
    for await (const { data: commits } of iterator) {
      for (const commit of commits) {
        const date = getYMDFormat(commit.commit.author?.date); // date not undefined
        if (commitCounts[date]) {
          commitCounts[date]++;
        } else {
          commitCounts[date] = 1;
        }
      }
    }
    // save commit counts
    for (const [date, count] of Object.entries(commitCounts)) {
      if (isDateToday(date)) {
        await this.commitCountService.updateTodayRecord({
          count,
          repo: job.data.repo,
          username: job.data.author,
          commitsDate: date,
        });
      } else {
        newCounts.push({
          count,
          repo: job.data.repo,
          username: job.data.author,
          commitsDate: date,
        });
      }
    }
    return await this.commitCountService.saveCommitCountRecords(newCounts);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    console.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    console.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }
}
