import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { COUNT_COMMITS_QUEUE_NAME } from 'src/config/constants';
import { CountCommitsJob } from 'src/dto/countCommits.dto';
import { User } from 'src/entities/users.entity';
import { UserStoredEvent } from 'src/events/user-created.event';
import { GithubApiService } from 'src/github-api/github-api.service';
import { Repository } from 'typeorm';

@Injectable()
export class CountCommitsListener {
  constructor(
    @InjectQueue(COUNT_COMMITS_QUEUE_NAME) private countCommitsQueue: Queue,
    private githubApiService: GithubApiService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @OnEvent(UserStoredEvent.name)
  async userLoggedIn(payload: UserStoredEvent) {
    const { token, username, since } = payload;

    try {
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
          this.countCommitsQueue.add('countCommits', payload).catch((err) => {
            console.log(err);
          }); // await?
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
