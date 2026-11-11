import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProjectRole } from '../../common/enums/project-role.enum.js';
import type { Member } from '../../members/entities/member.entity.js';
import type { Project } from './project.entity.js';

@Entity('project_members')
@Unique('UQ_project_members_project_member', ['projectId', 'memberId'])
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ManyToOne('Project', 'projectMembers', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @ManyToOne('Member', 'projectMembers', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({
    type: 'enum',
    enum: ProjectRole,
    default: ProjectRole.MEMBER,
  })
  role: ProjectRole;

  @CreateDateColumn({ name: 'joined_at', type: 'timestamptz' })
  joinedAt: Date;
}
