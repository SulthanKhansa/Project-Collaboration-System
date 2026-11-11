import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity.js';
import { Project } from '../projects/entities/project.entity.js';
import { FileMetadata } from './entities/file-metadata.entity.js';
import { FilesController } from './files.controller.js';
import { FilesService } from './files.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([FileMetadata, Project, Member])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
