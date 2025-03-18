import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GithubApiModule } from './github-api/github-api.module';
import { CommitCountModule } from './commit-count/commit-count.module';
import { QueuesModule } from './queues/queues.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    EventEmitterModule.forRoot(),
    QueuesModule,
    AuthModule,
    GithubApiModule,
    CommitCountModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
