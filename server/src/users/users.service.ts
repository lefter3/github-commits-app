import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { COUNT_COMMITS_QUEUE_NAME } from 'src/config/constants';
import { CountCommitsJob } from 'src/dto/countCommits.dto';
import { TokenPayload } from 'src/dto/request.dto';
import { User } from 'src/entities/users.entity';
import { GithubApiService } from 'src/github-api/github-api.service';
import { getYMDFormat } from 'src/util/utils';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectQueue(COUNT_COMMITS_QUEUE_NAME) private countCommitsQueue: Queue,
    private githubApiService: GithubApiService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async afterGithubLogin(payload: TokenPayload) {
    const { ghToken, username, displayName } = payload;
    let since: string | null = null;

    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      await this.userRepository.save({
        username,
        displayName,
        lastLogin: getYMDFormat(),
      });
    } else {
      since = getYMDFormat(user.lastLogin);
      await this.userRepository.update(user.id, { lastLogin: since });
    }

    const repositories =
      this.githubApiService.getAllRepositoriesForUser(ghToken);
    for await (const { data: repos } of repositories) {
      for (const repo of repos) {
        const payload: CountCommitsJob = {
          author: username,
          owner: repo.owner.login,
          repo: repo.name,
          ...(since && { since }),
        };
        await this.countCommitsQueue.add('countCommits', payload);
      }
    }
  }
}
