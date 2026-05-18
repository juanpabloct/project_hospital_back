import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISpecialtyRepository } from '../../../domain/repositories/ISpecialtyRepository.js';
import { Specialty } from '../../../domain/entities/Specialty.js';
import { SpecialtyORMEntity } from '../entities/SpecialtyORMEntity.js';
import { SpecialtyMapper } from './SpecialtyMapper.js';

@Injectable()
export class SpecialtyRepositoryORM implements ISpecialtyRepository {
  constructor(
    @InjectRepository(SpecialtyORMEntity)
    private readonly ormRepository: Repository<SpecialtyORMEntity>,
  ) {}

  async save(specialty: Specialty): Promise<Specialty> {
    const orm = SpecialtyMapper.toORM(specialty);
    const saved = await this.ormRepository.save(orm);
    return SpecialtyMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Specialty | null> {
    const orm = await this.ormRepository.findOneBy({ id });
    return orm ? SpecialtyMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Specialty[]> {
    const orms = await this.ormRepository.find();
    return orms.map(SpecialtyMapper.toDomain);
  }
}
