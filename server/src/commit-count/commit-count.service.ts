import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommitCountDto } from 'src/dto/countCommits.dto';
import { CommitCount } from 'src/entities/commitsCount.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class CommitCountService {
  constructor(
    @InjectRepository(CommitCount)
    private commitCountRepo: Repository<CommitCount>,
  ) {}

  async saveCommitCountRecords(
    commitCounts: CommitCountDto[],
  ): Promise<number> {
    if (!commitCounts.length) {
      return 0;
    }
    const result: InsertResult =
      await this.commitCountRepo.insert(commitCounts);
    return result.identifiers.length;
  }

  async updateTodayRecord(payload: CommitCountDto) {
    await this.commitCountRepo.update(
      {
        repo: payload.repo,
        username: payload.username,
        commitsDate: payload.commitsDate,
      },
      { count: payload.count },
    );
  }

  async getCommitCountRecords() {
    return this.commitCountRepo.find();
  }
}
