import { Patient } from '../../../domain/entities/Patient.js';
import { PatientORMEntity } from '../entities/PatientORMEntity.js';

export class PatientMapper {
  static toDomain(ormEntity: PatientORMEntity): Patient {
    return new Patient(
      ormEntity.id,
      ormEntity.firstName,
      ormEntity.lastName,
      ormEntity.documentType,
      ormEntity.documentNumber,
      ormEntity.email,
      ormEntity.phone,
      ormEntity.eps,
      ormEntity.registrationDate,
    );
  }

  static toORM(domainEntity: Patient): PatientORMEntity {
    const ormEntity = new PatientORMEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.firstName = domainEntity.firstName;
    ormEntity.lastName = domainEntity.lastName;
    ormEntity.documentType = domainEntity.documentType;
    ormEntity.documentNumber = domainEntity.documentNumber;
    ormEntity.email = domainEntity.email;
    ormEntity.phone = domainEntity.phone;
    ormEntity.eps = domainEntity.eps;
    ormEntity.registrationDate = domainEntity.registrationDate;
    return ormEntity;
  }
}
