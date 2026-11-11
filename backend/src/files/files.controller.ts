import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFileMetadataDto } from './dto/create-file-metadata.dto.js';
import { UpdateFileMetadataDto } from './dto/update-file-metadata.dto.js';
import { FilesService } from './files.service.js';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('projects/:projectId/files')
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateFileMetadataDto,
  ) {
    return this.filesService.create(projectId, dto);
  }

  @Get('projects/:projectId/files')
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.filesService.findAll(projectId);
  }

  @Get('files/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.findOne(id);
  }

  @Patch('files/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFileMetadataDto,
  ) {
    return this.filesService.update(id, dto);
  }

  @Delete('files/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.remove(id);
  }
}
