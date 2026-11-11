import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AddProjectMemberDto } from './dto/add-project-member.dto.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectMembersService } from './project-members.service.js';
import { ProjectsService } from './projects.service.js';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':projectId/members')
  addMember(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: AddProjectMemberDto,
  ) {
    return this.projectMembersService.add(projectId, dto);
  }

  @Get(':projectId/members')
  findMembers(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.projectMembersService.findAll(projectId);
  }

  @Patch(':projectId/members/:memberId')
  updateMemberRole(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body() dto: UpdateProjectMemberDto,
  ) {
    return this.projectMembersService.updateRole(projectId, memberId, dto);
  }

  @Delete(':projectId/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ) {
    return this.projectMembersService.remove(projectId, memberId);
  }
}
