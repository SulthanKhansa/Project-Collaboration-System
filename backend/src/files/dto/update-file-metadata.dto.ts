import { PartialType } from '@nestjs/mapped-types';
import { CreateFileMetadataDto } from './create-file-metadata.dto.js';

export class UpdateFileMetadataDto extends PartialType(CreateFileMetadataDto) {}
