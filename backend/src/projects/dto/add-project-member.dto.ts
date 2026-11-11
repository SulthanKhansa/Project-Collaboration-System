import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ProjectRole } from '../../common/enums/project-role.enum.js';

export class AddProjectMemberDto {
  @IsUUID()
  memberId: string;

  @IsOptional()
  @IsEnum(ProjectRole)
  role?: ProjectRole;
}
