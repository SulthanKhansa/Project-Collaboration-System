import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUniqueViolation } from '../common/utils/database-errors.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { UpdateMemberDto } from './dto/update-member.dto.js';
import { Member } from './entities/member.entity.js';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async create(dto: CreateMemberDto): Promise<Member> {
    const email = dto.email.toLowerCase();

    await this.ensureEmailIsAvailable(email);

    const member = this.membersRepository.create({
      name: dto.name,
      email,
      jobTitle: dto.jobTitle ?? null,
    });

    try {
      return await this.membersRepository.save(member);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(`Email ${email} is already registered`);
      }

      throw error;
    }
  }

  findAll(): Promise<Member[]> {
    return this.membersRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.membersRepository.findOneBy({ id });

    if (!member) {
      throw new NotFoundException(`Member with id ${id} was not found`);
    }

    return member;
  }

  async update(id: string, dto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);

    if (dto.email !== undefined) {
      const email = dto.email.toLowerCase();

      if (email !== member.email) {
        await this.ensureEmailIsAvailable(email);
      }

      member.email = email;
    }

    if (dto.name !== undefined) {
      member.name = dto.name;
    }

    if (dto.jobTitle !== undefined) {
      member.jobTitle = dto.jobTitle;
    }

    try {
      return await this.membersRepository.save(member);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          `Email ${member.email} is already registered`,
        );
      }

      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.membersRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Member with id ${id} was not found`);
    }
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const existing = await this.membersRepository.findOneBy({ email });

    if (existing) {
      throw new ConflictException(`Email ${email} is already registered`);
    }
  }
}
