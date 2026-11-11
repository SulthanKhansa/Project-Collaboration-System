import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity.js';
import { Project } from '../projects/entities/project.entity.js';
import { CreateFileMetadataDto } from './dto/create-file-metadata.dto.js';
import { UpdateFileMetadataDto } from './dto/update-file-metadata.dto.js';
import { FileMetadata } from './entities/file-metadata.entity.js';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileMetadata)
    private readonly filesRepository: Repository<FileMetadata>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async create(
    projectId: string,
    dto: CreateFileMetadataDto,
  ): Promise<FileMetadata> {
    await this.ensureProjectExists(projectId);

    if (dto.uploadedById) {
      await this.ensureMemberExists(dto.uploadedById);
    }

    const file = this.filesRepository.create({
      projectId,
      originalName: dto.originalName,
      storageKey: dto.storageKey,
      mimeType: dto.mimeType,
      size: dto.size,
      uploadedById: dto.uploadedById ?? null,
    });
    const saved = await this.filesRepository.save(file);

    return this.findOne(saved.id);
  }

  async findAll(projectId: string): Promise<FileMetadata[]> {
    await this.ensureProjectExists(projectId);

    return this.filesRepository.find({
      where: { projectId },
      relations: { uploadedBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<FileMetadata> {
    const file = await this.filesRepository.findOne({
      where: { id },
      relations: { uploadedBy: true, project: true },
    });

    if (!file) {
      throw new NotFoundException(`File with id ${id} was not found`);
    }

    return file;
  }

  async update(
    id: string,
    dto: UpdateFileMetadataDto,
  ): Promise<FileMetadata> {
    const file = await this.findOne(id);

    if (dto.originalName !== undefined) {
      file.originalName = dto.originalName;
    }

    if (dto.storageKey !== undefined) {
      file.storageKey = dto.storageKey;
    }

    if (dto.mimeType !== undefined) {
      file.mimeType = dto.mimeType;
    }

    if (dto.size !== undefined) {
      file.size = dto.size;
    }

    if (dto.uploadedById !== undefined) {
      if (dto.uploadedById === null) {
        file.uploadedById = null;
        file.uploadedBy = null;
      } else {
        const uploader = await this.ensureMemberExists(dto.uploadedById);
        file.uploadedById = uploader.id;
        file.uploadedBy = uploader;
      }
    }

    await this.filesRepository.save(file);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.filesRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`File with id ${id} was not found`);
    }
  }

  private async ensureProjectExists(projectId: string): Promise<void> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new NotFoundException(
        `Project with id ${projectId} was not found`,
      );
    }
  }

  private async ensureMemberExists(memberId: string): Promise<Member> {
    const member = await this.membersRepository.findOneBy({ id: memberId });

    if (!member) {
      throw new NotFoundException(`Member with id ${memberId} was not found`);
    }

    return member;
  }
}
