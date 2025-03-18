import { InjectQueue, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Queue } from 'bullmq';
import { COUNT_COMMITS_QUEUE_NAME } from 'src/config/constants';
import { CountCommitsJob } from 'src/dto/countCommits.dto';
import { TokenPayload } from 'src/dto/request.dto';
import { User } from 'src/entities/users.entity';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { GithubApiService } from 'src/github-api/github-api.service';
import { getYMDFormat } from 'src/util/utils';
import { Repository } from 'typeorm';

@Injectable()
export class CountCommitsListener {
  constructor(
    @InjectQueue(COUNT_COMMITS_QUEUE_NAME) private countCommitsQueue: Queue,
    private githubApiService: GithubApiService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}


  @OnEvent(UserCreatedEvent.name)
  async afterGithubLogin(payload: TokenPayload) {
    const { token, username } = payload;
    let since: string | null = null;

    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      await this.userRepository.save({
        username,
        lastLogin: getYMDFormat(),
      });
    } else {
      since = getYMDFormat(user.lastLogin);
      await this.userRepository.update(user.id, { lastLogin: since });
    }

    const repositories =
      this.githubApiService.getAllRepositoriesForUser(token);
    for await (const { data: repos } of repositories) {
      for (const repo of repos) {
        const payload: CountCommitsJob = {
          author: username,
          owner: repo.owner.login,
          repo: repo.name,
          ...(since && { since }),
        };
        this.countCommitsQueue.add('countCommits', payload); // await?
      }
    }
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
} /// ev listener on queue
