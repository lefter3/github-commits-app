import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GithubApiModule } from './github-api/github-api.module';
import { CommitCountModule } from './commit-count/commit-count.module';
import { QueuesModule } from './queues/queues.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static'; // New
import { join } from 'path'; // New

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'client-build/dist'),
    }),
  ],
})
export class AppModule {}
