import { Appointment } from '../../../domain/entities/Appointment.js';
import { AppointmentORMEntity } from '../entities/AppointmentORMEntity.js';

export class AppointmentMapper {
  static toDomain(orm: AppointmentORMEntity): Appointment {
    const dateObj = typeof orm.appointmentDate === 'string' ? new Date(orm.appointmentDate) : orm.appointmentDate;
    return new Appointment(
      orm.id,
      orm.patientId,
      orm.doctorId,
      dateObj,
      orm.startTime,
      orm.endTime,
      orm.status,
      orm.createdAt,
    );
  }

  static toORM(domain: Appointment): AppointmentORMEntity {
    const orm = new AppointmentORMEntity();
    orm.id = domain.id;
    orm.patientId = domain.patientId;
    orm.doctorId = domain.doctorId;
    orm.appointmentDate = domain.appointmentDate;
    orm.startTime = domain.startTime;
    orm.endTime = domain.endTime;
    orm.status = domain.status;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
