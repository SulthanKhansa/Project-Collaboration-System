import { IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  authorId: string;

  @IsString()
  @Length(1, 5000)
  content: string;
}
