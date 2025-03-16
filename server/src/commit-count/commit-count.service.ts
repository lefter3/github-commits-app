import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommitCount } from 'src/entities/commitsCount';
import { Repository } from 'typeorm';

@Injectable()
export class CommitCountService {
  constructor(
    @InjectRepository(CommitCount)
    private commitCountRepo: Repository<CommitCount>,
  ) {}

  async saveCommitCountRecords(commitCounts: CommitCount[]) {
    try {
      const result = await this.commitCountRepo
        .createQueryBuilder()
        .insert()
        .values(commitCounts)
        .execute();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
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
