import { IsEnum } from 'class-validator';
import { ProjectRole } from '../../common/enums/project-role.enum.js';

export class UpdateProjectMemberDto {
  @IsEnum(ProjectRole)
  role: ProjectRole;
}
