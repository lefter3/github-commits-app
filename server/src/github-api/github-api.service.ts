import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { AppTokenPayload } from 'src/dto/appTokenPayload.dto';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class GithubApiService {
  constructor() {}

  listRepositoriesForUser(payload: AppTokenPayload, query: PaginationDto) {
    const octokit = new Octokit({ auth: payload.ghToken });
    return octokit.rest.repos.listForAuthenticatedUser({
      //listReposStarredByAuthenticatedUser
      per_page: query.per_page,
      page: query.page,
    });
  }

  getAllRepositoriesForUser(payload: AppTokenPayload) {
    const octokit = new Octokit({ auth: payload.ghToken });
    return octokit.paginate.iterator(
      octokit.rest.repos.listForAuthenticatedUser,
      {
        per_page: 100,
      },
    );
  }
}
