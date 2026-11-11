import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { CommentsModule } from './comments/comments.module.js';
import { FilesModule } from './files/files.module.js';
import { MembersModule } from './members/members.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: Number(config.get<string>('DB_PORT') ?? 5432),
        username: config.get<string>('DB_USERNAME') ?? 'project_collab',
        password: config.get<string>('DB_PASSWORD') ?? 'project_collab',
        database: config.get<string>('DB_NAME') ?? 'project_collab',
        autoLoadEntities: true,
        synchronize:
          (config.get<string>('DB_SYNCHRONIZE') ?? 'true') === 'true',
        logging: (config.get<string>('DB_LOGGING') ?? 'false') === 'true',
      }),
    }),
    ProjectsModule,
    MembersModule,
    TasksModule,
    CommentsModule,
    FilesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
