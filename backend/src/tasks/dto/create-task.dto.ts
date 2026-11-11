import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { TaskPriority } from '../../common/enums/task-priority.enum.js';
import { TaskStatus } from '../../common/enums/task-status.enum.js';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class CreateTaskDto {
  @IsString()
  @Length(1, 200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @Matches(DATE_ONLY_PATTERN, {
    message: 'dueDate must use the YYYY-MM-DD format',
  })
  dueDate?: string | null;
}
