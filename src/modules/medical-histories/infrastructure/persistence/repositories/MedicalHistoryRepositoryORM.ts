import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { IMedicalHistoryRepository } from '../../../domain/repositories/IMedicalHistoryRepository.js';
import { MedicalHistoryRecord } from '../../../domain/entities/MedicalHistoryRecord.js';
import { MedicalHistoryRecordORMEntity } from '../entities/MedicalHistoryRecordORMEntity.js';
import { MedicalHistorySupplyORMEntity } from '../entities/MedicalHistorySupplyORMEntity.js';
import { PatientORMEntity } from '../../../../patients/infrastructure/persistence/entities/PatientORMEntity.js';
import { DoctorORMEntity } from '../../../../appointments/infrastructure/persistence/entities/DoctorORMEntity.js';
import { AppointmentORMEntity } from '../../../../appointments/infrastructure/persistence/entities/AppointmentORMEntity.js';
import { ResourceORMEntity } from '../../../../resources/infrastructure/persistence/entities/ResourceORMEntity.js';
import { MedicalHistoryMapper } from './MedicalHistoryMapper.js';
import { InsufficientResourceQuantityError } from '../../../domain/exceptions/InsufficientResourceQuantityError.js';
import { EntityNotFoundError } from '../../../../appointments/domain/exceptions/EntityNotFoundError.js';

@Injectable()
export class MedicalHistoryRepositoryORM implements IMedicalHistoryRepository {
  constructor(
    @InjectRepository(MedicalHistoryRecordORMEntity)
    private readonly ormRepository: Repository<MedicalHistoryRecordORMEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(record: MedicalHistoryRecord): Promise<MedicalHistoryRecord> {
    return this.dataSource.transaction(async (entityManager) => {
      // 1. Verify Patient exists
      const patientExists = await entityManager.findOneBy(PatientORMEntity, { id: record.patientId });
      if (!patientExists) {
        throw new EntityNotFoundError('Patient', record.patientId);
      }

      // 2. Verify Doctor exists
      const doctorExists = await entityManager.findOneBy(DoctorORMEntity, { id: record.doctorId });
      if (!doctorExists) {
        throw new EntityNotFoundError('Doctor', record.doctorId);
      }

      // 3. If appointmentId is provided, verify Appointment exists
      if (record.appointmentId) {
        const appointmentExists = await entityManager.findOneBy(AppointmentORMEntity, { id: record.appointmentId });
        if (!appointmentExists) {
          throw new EntityNotFoundError('Appointment', record.appointmentId);
        }
      }

      // 4. Validate and deduct supplies/resources using pessimistic locking
      for (const supply of record.supplies) {
        const resourceOrm = await entityManager
          .createQueryBuilder(ResourceORMEntity, 'resource')
          .setLock('pessimistic_write')
          .where('resource.id = :resourceId', { resourceId: supply.resourceId })
          .getOne();

        if (!resourceOrm) {
          throw new EntityNotFoundError('Resource', supply.resourceId);
        }

        if (resourceOrm.quantity < supply.quantity) {
          throw new InsufficientResourceQuantityError(resourceOrm.name, resourceOrm.quantity, supply.quantity);
        }

        // Deduct quantity
        resourceOrm.quantity -= supply.quantity;
        await entityManager.save(ResourceORMEntity, resourceOrm);
      }

      // 5. Save MedicalHistoryRecordORMEntity
      const ormRecord = MedicalHistoryMapper.toORM(record);
      const savedRecordOrm = await entityManager.save(MedicalHistoryRecordORMEntity, ormRecord);

      // 6. Save MedicalHistorySupplyORMEntity entries
      for (const supply of record.supplies) {
        const ormSupply = new MedicalHistorySupplyORMEntity();
        ormSupply.id = randomUUID();
        ormSupply.medicalHistoryRecordId = savedRecordOrm.id;
        ormSupply.resourceId = supply.resourceId;
        ormSupply.quantity = supply.quantity;
        await entityManager.save(MedicalHistorySupplyORMEntity, ormSupply);
      }

      // 7. Load and return the fully populated record to map to domain
      const fullyPopulatedOrm = await entityManager.findOne(MedicalHistoryRecordORMEntity, {
        where: { id: savedRecordOrm.id },
        relations: ['supplies', 'supplies.resource'],
      });

      if (!fullyPopulatedOrm) {
        throw new Error('Failed to retrieve newly saved Medical History Record.');
      }

      return MedicalHistoryMapper.toDomain(fullyPopulatedOrm);
    });
  }

  async findById(id: string): Promise<MedicalHistoryRecord | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['supplies', 'supplies.resource'],
    });
    return orm ? MedicalHistoryMapper.toDomain(orm) : null;
  }

  async findByPatientId(patientId: string): Promise<MedicalHistoryRecord[]> {
    const orms = await this.ormRepository.find({
      where: { patientId },
      relations: ['supplies', 'supplies.resource'],
      order: { createdAt: 'DESC' },
    });
    return orms.map(MedicalHistoryMapper.toDomain);
  }

  async findByDoctorId(doctorId: string): Promise<MedicalHistoryRecord[]> {
    const orms = await this.ormRepository.find({
      where: { doctorId },
      relations: ['supplies', 'supplies.resource'],
      order: { createdAt: 'DESC' },
    });
    return orms.map(MedicalHistoryMapper.toDomain);
  }

  async findAll(): Promise<MedicalHistoryRecord[]> {
    const orms = await this.ormRepository.find({
      relations: ['supplies', 'supplies.resource'],
      order: { createdAt: 'DESC' },
    });
    return orms.map(MedicalHistoryMapper.toDomain);
  }
}
