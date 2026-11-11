import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectRole } from '../common/enums/project-role.enum.js';
import { isUniqueViolation } from '../common/utils/database-errors.js';
import { Member } from '../members/entities/member.entity.js';
import { AddProjectMemberDto } from './dto/add-project-member.dto.js';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto.js';
import { ProjectMember } from './entities/project-member.entity.js';
import { Project } from './entities/project.entity.js';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly projectMembersRepository: Repository<ProjectMember>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async add(
    projectId: string,
    dto: AddProjectMemberDto,
  ): Promise<ProjectMember> {
    await this.ensureProjectExists(projectId);
    await this.ensureMemberExists(dto.memberId);

    const existing = await this.projectMembersRepository.findOneBy({
      projectId,
      memberId: dto.memberId,
    });

    if (existing) {
      throw new ConflictException(
        'This member is already assigned to the project',
      );
    }

    const projectMember = this.projectMembersRepository.create({
      projectId,
      memberId: dto.memberId,
      role: dto.role ?? ProjectRole.MEMBER,
    });

    try {
      return await this.projectMembersRepository.save(projectMember);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'This member is already assigned to the project',
        );
      }

      throw error;
    }
  }

  async findAll(projectId: string): Promise<ProjectMember[]> {
    await this.ensureProjectExists(projectId);

    return this.projectMembersRepository.find({
      where: { projectId },
      relations: { member: true },
      order: { joinedAt: 'ASC' },
    });
  }

  async updateRole(
    projectId: string,
    memberId: string,
    dto: UpdateProjectMemberDto,
  ): Promise<ProjectMember> {
    await this.ensureProjectExists(projectId);

    const projectMember = await this.projectMembersRepository.findOneBy({
      projectId,
      memberId,
    });

    if (!projectMember) {
      throw new NotFoundException(
        'This member is not assigned to the project',
      );
    }

    projectMember.role = dto.role;
    return this.projectMembersRepository.save(projectMember);
  }

  async remove(projectId: string, memberId: string): Promise<void> {
    await this.ensureProjectExists(projectId);

    const result = await this.projectMembersRepository.delete({
      projectId,
      memberId,
    });

    if (!result.affected) {
      throw new NotFoundException(
        'This member is not assigned to the project',
      );
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

  private async ensureMemberExists(memberId: string): Promise<void> {
    const member = await this.membersRepository.findOneBy({ id: memberId });

    if (!member) {
      throw new NotFoundException(`Member with id ${memberId} was not found`);
    }
  }
}
