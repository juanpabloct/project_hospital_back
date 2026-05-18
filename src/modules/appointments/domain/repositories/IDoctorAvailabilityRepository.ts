import { DoctorAvailability } from '../entities/DoctorAvailability.js';

export interface IDoctorAvailabilityRepository {
  save(availability: DoctorAvailability): Promise<DoctorAvailability>;
  saveMany(availabilities: DoctorAvailability[]): Promise<DoctorAvailability[]>;
  findById(id: string): Promise<DoctorAvailability | null>;
  findAvailableByDoctor(doctorId: string, date?: Date): Promise<DoctorAvailability[]>;
}
