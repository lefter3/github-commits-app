import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { GetUserCommitsDto } from 'src/dto/countCommits.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { TokenPayload } from 'src/dto/request.dto';

@Injectable()
export class GithubApiService {
  constructor() {}

  listRepositoriesForUser(payload: TokenPayload, query: PaginationDto) {
    const octokit = new Octokit({ auth: payload.ghToken });
    return octokit.rest.repos.listForAuthenticatedUser({
      //listReposStarredByAuthenticatedUser
      per_page: query.per_page,
      page: query.page,
    });
  }

  getAllRepositoriesForUser(token: string) {
    const octokit = new Octokit({ auth: token });
    return octokit.paginate.iterator(
      octokit.rest.repos.listForAuthenticatedUser,
      // listReposStarredByAuthenticatedUser
      {
        per_page: 100,
      },
    );
  }

  getUserCommitsForRepo(payload: GetUserCommitsDto) {
    const { author, owner, repo, since } = payload;
    const octokit = new Octokit();
    return octokit.paginate.iterator(octokit.rest.repos.listCommits, {
      author,
      owner,
      repo,
      ...(since && { since }),
      per_page: 100,
    });
  }
}
