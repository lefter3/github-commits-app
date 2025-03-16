import { Module } from '@nestjs/common';
import { CommitCountService } from './commit-count.service';
import { CommitCountController } from './commit-count.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitCount } from 'src/entities/commitsCount';

@Module({
  imports: [TypeOrmModule.forFeature([CommitCount])],
  providers: [CommitCountService],
  controllers: [CommitCountController],
  exports: [CommitCountService],
})
export class CommitCountModule {}
