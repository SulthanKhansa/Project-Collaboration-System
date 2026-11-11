import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @Length(1, 150)
  name: string;

  @IsEmail()
  @Length(1, 150)
  email: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  jobTitle?: string | null;
}
