import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommitCountService } from './commit-count.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('commit-count')
export class CommitCountController {
  constructor(private commitCountService: CommitCountService) {}

  @Get()
  async getCommitCountRecords() {
    return this.commitCountService.getCommitCountRecords();
  }
}
