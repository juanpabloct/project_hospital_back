import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository.js';
import { Doctor } from '../../../domain/entities/Doctor.js';
import { DoctorORMEntity } from '../entities/DoctorORMEntity.js';
import { DoctorMapper } from './DoctorMapper.js';

@Injectable()
export class DoctorRepositoryORM implements IDoctorRepository {
  constructor(
    @InjectRepository(DoctorORMEntity)
    private readonly ormRepository: Repository<DoctorORMEntity>,
  ) {}

  async save(doctor: Doctor): Promise<Doctor> {
    const orm = DoctorMapper.toORM(doctor);
    const saved = await this.ormRepository.save(orm);
    return DoctorMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Doctor | null> {
    const orm = await this.ormRepository.findOneBy({ id });
    return orm ? DoctorMapper.toDomain(orm) : null;
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    const orm = await this.ormRepository.findOneBy({ userId });
    return orm ? DoctorMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Doctor[]> {
    const orms = await this.ormRepository.find();
    return orms.map(DoctorMapper.toDomain);
  }

  async findBySpecialty(specialtyId: string): Promise<Doctor[]> {
    const orms = await this.ormRepository.findBy({ specialtyId });
    return orms.map(DoctorMapper.toDomain);
  }
}
