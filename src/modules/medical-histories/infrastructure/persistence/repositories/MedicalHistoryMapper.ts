import { MedicalHistoryRecord, MedicalHistorySupply } from '../../../domain/entities/MedicalHistoryRecord.js';
import { MedicalHistoryRecordORMEntity } from '../entities/MedicalHistoryRecordORMEntity.js';
import { MedicalHistorySupplyORMEntity } from '../entities/MedicalHistorySupplyORMEntity.js';

export class MedicalHistoryMapper {
  static toDomain(orm: MedicalHistoryRecordORMEntity): MedicalHistoryRecord {
    const supplies = orm.supplies
      ? orm.supplies.map(
          (s) => new MedicalHistorySupply(s.resourceId, s.resource ? s.resource.name : '', s.quantity),
        )
      : [];

    return new MedicalHistoryRecord(
      orm.id,
      orm.patientId,
      orm.doctorId,
      orm.appointmentId,
      orm.diagnosis,
      orm.treatment,
      supplies,
      orm.createdAt,
    );
  }

  static toORM(domain: MedicalHistoryRecord): MedicalHistoryRecordORMEntity {
    const orm = new MedicalHistoryRecordORMEntity();
    orm.id = domain.id;
    orm.patientId = domain.patientId;
    orm.doctorId = domain.doctorId;
    orm.appointmentId = domain.appointmentId;
    orm.diagnosis = domain.diagnosis;
    orm.treatment = domain.treatment;
    orm.createdAt = domain.createdAt;
    // Note: supplies mapping is handled inside the repository transaction
    return orm;
  }
}
