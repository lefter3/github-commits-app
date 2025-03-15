import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  per_page?: number = 10;

  @IsOptional()
  @Min(0)
  page?: number;
}
