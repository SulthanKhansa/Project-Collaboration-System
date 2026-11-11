import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum.js';

export class TaskQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
