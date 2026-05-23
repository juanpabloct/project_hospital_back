import { Patient } from '../entities/Patient.js';

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  findByDocument(documentType: string, documentNumber: string): Promise<Patient | null>;
  findByEmail(email: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient>;
  findAll(): Promise<Patient[]>;
}
