import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ProjectStatus } from '../../common/enums/project-status.enum.js';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class CreateProjectDto {
  @IsString()
  @Length(1, 150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @Matches(DATE_ONLY_PATTERN, {
    message: 'startDate must use the YYYY-MM-DD format',
  })
  startDate?: string | null;

  @IsOptional()
  @Matches(DATE_ONLY_PATTERN, {
    message: 'endDate must use the YYYY-MM-DD format',
  })
  endDate?: string | null;
}
