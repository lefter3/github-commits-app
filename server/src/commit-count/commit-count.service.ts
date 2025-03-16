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

  async saveCommitCountRecords(commitCounts: CommitCountDto[]) {
    if (!commitCounts.length) {
      return true;
    }
    try {
      const result: InsertResult =
        await this.commitCountRepo.insert(commitCounts);
      console.log('Inserted commit counts:', result.identifiers);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
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
    try {
      const result = await this.commitCountRepo.find(); // group by repo name
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
