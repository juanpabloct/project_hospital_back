import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDoctorAvailabilityRepository } from '../../../domain/repositories/IDoctorAvailabilityRepository.js';
import { DoctorAvailability } from '../../../domain/entities/DoctorAvailability.js';
import { DoctorAvailabilityORMEntity } from '../entities/DoctorAvailabilityORMEntity.js';
import { DoctorAvailabilityMapper } from './DoctorAvailabilityMapper.js';

@Injectable()
export class DoctorAvailabilityRepositoryORM implements IDoctorAvailabilityRepository {
  constructor(
    @InjectRepository(DoctorAvailabilityORMEntity)
    private readonly ormRepository: Repository<DoctorAvailabilityORMEntity>,
  ) {}

  async save(availability: DoctorAvailability): Promise<DoctorAvailability> {
    const orm = DoctorAvailabilityMapper.toORM(availability);
    const saved = await this.ormRepository.save(orm);
    return DoctorAvailabilityMapper.toDomain(saved);
  }

  async saveMany(availabilities: DoctorAvailability[]): Promise<DoctorAvailability[]> {
    const orms = availabilities.map(DoctorAvailabilityMapper.toORM);
    const saved = await this.ormRepository.save(orms);
    return saved.map(DoctorAvailabilityMapper.toDomain);
  }

  async findById(id: string): Promise<DoctorAvailability | null> {
    const orm = await this.ormRepository.findOneBy({ id });
    return orm ? DoctorAvailabilityMapper.toDomain(orm) : null;
  }

  async findAvailableByDoctor(doctorId: string, date?: Date): Promise<DoctorAvailability[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder('availability')
      .where('availability.doctorId = :doctorId', { doctorId })
      .andWhere('availability.isBooked = :isBooked', { isBooked: false });

    if (date) {
      // Format to YYYY-MM-DD
      const dateString = date.toISOString().split('T')[0];
      queryBuilder.andWhere('availability.date = :dateString', { dateString });
    }

    // Order slots chronologically
    queryBuilder.orderBy('availability.date', 'ASC')
      .addOrderBy('availability.startTime', 'ASC');

    const orms = await queryBuilder.getMany();
    return orms.map(DoctorAvailabilityMapper.toDomain);
  }
}
