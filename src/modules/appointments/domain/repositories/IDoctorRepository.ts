import { Doctor } from '../entities/Doctor.js';

export interface IDoctorRepository {
  save(doctor: Doctor): Promise<Doctor>;
  findById(id: string): Promise<Doctor | null>;
  findByUserId(userId: string): Promise<Doctor | null>;
  findAll(): Promise<Doctor[]>;
  findBySpecialty(specialtyId: string): Promise<Doctor[]>;
}
