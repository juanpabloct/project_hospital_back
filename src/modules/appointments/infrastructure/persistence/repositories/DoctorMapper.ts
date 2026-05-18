import { Doctor } from '../../../domain/entities/Doctor.js';
import { DoctorORMEntity } from '../entities/DoctorORMEntity.js';

export class DoctorMapper {
  static toDomain(orm: DoctorORMEntity): Doctor {
    return new Doctor(
      orm.id,
      orm.firstName,
      orm.lastName,
      orm.specialtyId,
      orm.email,
      orm.phone,
      orm.userId,
    );
  }

  static toORM(domain: Doctor): DoctorORMEntity {
    const orm = new DoctorORMEntity();
    orm.id = domain.id;
    orm.firstName = domain.firstName;
    orm.lastName = domain.lastName;
    orm.specialtyId = domain.specialtyId;
    orm.email = domain.email;
    orm.phone = domain.phone;
    orm.userId = domain.userId;
    return orm;
  }
}
