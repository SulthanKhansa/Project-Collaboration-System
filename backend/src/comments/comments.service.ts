import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity.js';
import { Task } from '../tasks/entities/task.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { Comment } from './entities/comment.entity.js';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async create(taskId: string, dto: CreateCommentDto): Promise<Comment> {
    await this.ensureTaskExists(taskId);
    await this.ensureMemberExists(dto.authorId);

    const comment = this.commentsRepository.create({
      taskId,
      authorId: dto.authorId,
      content: dto.content,
    });
    const saved = await this.commentsRepository.save(comment);

    return this.findById(saved.id);
  }

  async findAll(taskId: string): Promise<Comment[]> {
    await this.ensureTaskExists(taskId);

    return this.commentsRepository.find({
      where: { taskId },
      relations: { author: true },
      order: { createdAt: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findById(id);

    if (dto.content !== undefined) {
      comment.content = dto.content;
    }

    await this.commentsRepository.save(comment);

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.commentsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Comment with id ${id} was not found`);
    }
  }

  private async findById(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} was not found`);
    }

    return comment;
  }

  private async ensureTaskExists(taskId: string): Promise<void> {
    const task = await this.tasksRepository.findOneBy({ id: taskId });

    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} was not found`);
    }
  }

  private async ensureMemberExists(memberId: string): Promise<void> {
    const member = await this.membersRepository.findOneBy({ id: memberId });

    if (!member) {
      throw new NotFoundException(`Member with id ${memberId} was not found`);
    }
  }
}
