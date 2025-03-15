import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GithubApiService } from './github-api.service';
import { PaginationDto } from 'src/dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('github-api')
export class GithubApiController {
  constructor(private ghService: GithubApiService) {}

  @Get('repositories')
  getRepositories(@Req() req, @Query() query: PaginationDto) {
    return this.ghService.listRepositoriesForUser(req.user, query);
  }
}
