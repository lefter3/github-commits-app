import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CommitCountService } from './commit-count.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/dto/request.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('commit-count')
export class CommitCountController {
  constructor(private commitCountService: CommitCountService) {}

  @Get()
  async getCommitCountRecords(@Req() req: AuthRequest) {
    return this.commitCountService.getCommitCountRecords(req.user.username);
  }
}
