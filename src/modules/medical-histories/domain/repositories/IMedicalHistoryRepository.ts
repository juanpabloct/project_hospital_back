import { MedicalHistoryRecord } from '../entities/MedicalHistoryRecord.js';

export interface IMedicalHistoryRepository {
  save(record: MedicalHistoryRecord): Promise<MedicalHistoryRecord>;
  findById(id: string): Promise<MedicalHistoryRecord | null>;
  findByPatientId(patientId: string): Promise<MedicalHistoryRecord[]>;
  findByDoctorId(doctorId: string): Promise<MedicalHistoryRecord[]>;
  findAll(): Promise<MedicalHistoryRecord[]>;
}
