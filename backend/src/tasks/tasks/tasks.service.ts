import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TaskPriority } from '../common/enums/task-priority.enum.js';
import { TaskStatus } from '../common/enums/task-status.enum.js';
import { Member } from '../members/entities/member.entity.js';
import { Project } from '../projects/entities/project.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async create(projectId: string, dto: CreateTaskDto): Promise<Task> {
    await this.ensureProjectExists(projectId);

    if (dto.assigneeId) {
      await this.ensureMemberExists(dto.assigneeId);
    }

    const task = this.tasksRepository.create({
      projectId,
      title: dto.title,
      description: dto.description ?? null,
      assigneeId: dto.assigneeId ?? null,
      status: dto.status ?? TaskStatus.TODO,
      priority: dto.priority ?? TaskPriority.MEDIUM,
      dueDate: dto.dueDate ?? null,
    });
    const saved = await this.tasksRepository.save(task);

    return this.findOne(saved.id);
  }

  async findAll(projectId: string, query: TaskQueryDto): Promise<Task[]> {
    await this.ensureProjectExists(projectId);

    const where: FindOptionsWhere<Task> = { projectId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.assigneeId) {
      where.assigneeId = query.assigneeId;
    }

    return this.tasksRepository.find({
      where,
      relations: { assignee: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { assignee: true, project: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} was not found`);
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (dto.title !== undefined) {
      task.title = dto.title;
    }

    if (dto.description !== undefined) {
      task.description = dto.description;
    }

    if (dto.status !== undefined) {
      task.status = dto.status;
    }

    if (dto.priority !== undefined) {
      task.priority = dto.priority;
    }

    if (dto.dueDate !== undefined) {
      task.dueDate = dto.dueDate;
    }

    if (dto.assigneeId !== undefined) {
      if (dto.assigneeId === null) {
        task.assigneeId = null;
        task.assignee = null;
      } else {
        const assignee = await this.ensureMemberExists(dto.assigneeId);
        task.assigneeId = assignee.id;
        task.assignee = assignee;
      }
    }

    await this.tasksRepository.save(task);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Task with id ${id} was not found`);
    }
  }

  private async ensureProjectExists(projectId: string): Promise<void> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new NotFoundException(
        `Project with id ${projectId} was not found`,
      );
    }
  }

  private async ensureMemberExists(memberId: string): Promise<Member> {
    const member = await this.membersRepository.findOneBy({ id: memberId });

    if (!member) {
      throw new NotFoundException(`Member with id ${memberId} was not found`);
    }

    return member;
  }
}
