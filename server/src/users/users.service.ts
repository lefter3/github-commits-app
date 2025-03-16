import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { GithubApiService } from 'src/github-api/github-api.service';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private githubApiService: GithubApiService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async afterGithubLogin(username, ghToken) {
    const repositories = this.githubApiService.getAllRepositoriesForUser({
      username,
      ghToken,
    });
    for await (const { data: repos } of repositories) {
        for (const repo of repos) {
          // add to queue
        }
    }
  }
}
