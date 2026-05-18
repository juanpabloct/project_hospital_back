import { DoctorAvailability } from '../../../domain/entities/DoctorAvailability.js';
import { DoctorAvailabilityORMEntity } from '../entities/DoctorAvailabilityORMEntity.js';

export class DoctorAvailabilityMapper {
  static toDomain(orm: DoctorAvailabilityORMEntity): DoctorAvailability {
    // In PostgreSQL, date type can be read as a string or Date object depending on configuration.
    // We normalize it to a Date object here.
    const dateObj = typeof orm.date === 'string' ? new Date(orm.date) : orm.date;
    return new DoctorAvailability(
      orm.id,
      orm.doctorId,
      dateObj,
      orm.startTime,
      orm.endTime,
      orm.isBooked,
    );
  }

  static toORM(domain: DoctorAvailability): DoctorAvailabilityORMEntity {
    const orm = new DoctorAvailabilityORMEntity();
    orm.id = domain.id;
    orm.doctorId = domain.doctorId;
    orm.date = domain.date;
    orm.startTime = domain.startTime;
    orm.endTime = domain.endTime;
    orm.isBooked = domain.isBooked;
    return orm;
  }
}
