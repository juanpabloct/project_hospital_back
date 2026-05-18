import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResourceRepository } from '../../../domain/repositories/IResourceRepository.js';
import { Resource } from '../../../domain/entities/Resource.js';
import { ResourceORMEntity } from '../entities/ResourceORMEntity.js';
import { ResourceMapper } from './ResourceMapper.js';

@Injectable()
export class ResourceRepositoryORM implements IResourceRepository {
  constructor(
    @InjectRepository(ResourceORMEntity)
    private readonly ormRepository: Repository<ResourceORMEntity>,
  ) {}

  async save(resource: Resource): Promise<Resource> {
    const orm = ResourceMapper.toORM(resource);
    const saved = await this.ormRepository.save(orm);
    return ResourceMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Resource | null> {
    const orm = await this.ormRepository.findOneBy({ id });
    return orm ? ResourceMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Resource[]> {
    const orms = await this.ormRepository.find();
    return orms.map(ResourceMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }
}
