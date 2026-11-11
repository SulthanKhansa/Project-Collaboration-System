import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity.js';
import { Task } from '../tasks/entities/task.entity.js';
import { Comment } from './entities/comment.entity.js';
import { CommentsController } from './comments.controller.js';
import { CommentsService } from './comments.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Task, Member])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
