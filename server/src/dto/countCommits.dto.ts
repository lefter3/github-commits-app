export class GetUserCommitsDto {
  owner: string;
  repo: string;
  author: string;
  since?: string;
}
export class CountCommitsJob extends GetUserCommitsDto {}

export class CommitCountDto {
  count: number;
  repo: string;
  username: string;
  commitsDate: string;
}
