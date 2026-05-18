import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository.js';
import { Appointment, AppointmentStatus } from '../../../domain/entities/Appointment.js';
import { AppointmentORMEntity } from '../entities/AppointmentORMEntity.js';
import { DoctorAvailabilityORMEntity } from '../entities/DoctorAvailabilityORMEntity.js';
import { DoctorORMEntity } from '../entities/DoctorORMEntity.js';
import { AppointmentMapper } from './AppointmentMapper.js';
import { SlotNotAvailableError } from '../../../domain/exceptions/SlotNotAvailableError.js';
import { EntityNotFoundError } from '../../../domain/exceptions/EntityNotFoundError.js';

@Injectable()
export class AppointmentRepositoryORM implements IAppointmentRepository {
  constructor(
    @InjectRepository(AppointmentORMEntity)
    private readonly ormRepository: Repository<AppointmentORMEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(appointment: Appointment): Promise<Appointment> {
    const orm = AppointmentMapper.toORM(appointment);
    const saved = await this.ormRepository.save(orm);
    return AppointmentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Appointment | null> {
    const orm = await this.ormRepository.findOneBy({ id });
    return orm ? AppointmentMapper.toDomain(orm) : null;
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    const orms = await this.ormRepository.find({
      where: { patientId },
      order: { appointmentDate: 'ASC', startTime: 'ASC' },
    });
    return orms.map(AppointmentMapper.toDomain);
  }

  async findByDoctor(doctorId: string, date?: Date): Promise<Appointment[]> {
    const query = this.ormRepository.createQueryBuilder('appointment')
      .where('appointment.doctorId = :doctorId', { doctorId });

    if (date) {
      const dateString = date.toISOString().split('T')[0];
      query.andWhere('appointment.appointmentDate = :dateString', { dateString });
    }

    query.orderBy('appointment.appointmentDate', 'ASC')
      .addOrderBy('appointment.startTime', 'ASC');

    const orms = await query.getMany();
    return orms.map(AppointmentMapper.toDomain);
  }

  async bookAppointment(
    patientId: string,
    availabilityId: string,
    appointmentId: string,
  ): Promise<Appointment> {
    return this.dataSource.transaction(async (entityManager) => {
      // 1. Fetch DoctorAvailability slot with SELECT FOR UPDATE (Pessimistic Lock)
      const availabilityOrm = await entityManager
        .createQueryBuilder(DoctorAvailabilityORMEntity, 'availability')
        .setLock('pessimistic_write')
        .where('availability.id = :availabilityId', { availabilityId })
        .getOne();

      if (!availabilityOrm) {
        throw new EntityNotFoundError('DoctorAvailability', availabilityId);
      }

      if (availabilityOrm.isBooked) {
        throw new SlotNotAvailableError(availabilityId);
      }

      // 2. Mark the availability slot as booked
      availabilityOrm.isBooked = true;
      await entityManager.save(DoctorAvailabilityORMEntity, availabilityOrm);

      // 3. Verify doctor exists
      const doctorOrm = await entityManager.findOneBy(DoctorORMEntity, { id: availabilityOrm.doctorId });
      if (!doctorOrm) {
        throw new EntityNotFoundError('Doctor', availabilityOrm.doctorId);
      }

      // 4. Create and save new Appointment
      const appointmentOrm = new AppointmentORMEntity();
      appointmentOrm.id = appointmentId;
      appointmentOrm.patientId = patientId;
      appointmentOrm.doctorId = doctorOrm.id;
      appointmentOrm.appointmentDate = availabilityOrm.date;
      appointmentOrm.startTime = availabilityOrm.startTime;
      appointmentOrm.endTime = availabilityOrm.endTime;
      appointmentOrm.status = AppointmentStatus.SCHEDULED;

      const savedOrm = await entityManager.save(AppointmentORMEntity, appointmentOrm);
      return AppointmentMapper.toDomain(savedOrm);
    });
  }
}
