import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity.js';
import { ProjectMember } from './entities/project-member.entity.js';
import { Project } from './entities/project.entity.js';
import { ProjectMembersService } from './project-members.service.js';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember, Member])],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectMembersService],
})
export class ProjectsModule {}
