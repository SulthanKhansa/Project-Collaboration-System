import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateFileMetadataDto {
  @IsString()
  @Length(1, 255)
  originalName: string;

  @IsString()
  @Length(1, 500)
  storageKey: string;

  @IsString()
  @Length(1, 150)
  mimeType: string;

  @IsInt()
  @Min(0)
  size: number;

  @IsOptional()
  @IsUUID()
  uploadedById?: string | null;
}
