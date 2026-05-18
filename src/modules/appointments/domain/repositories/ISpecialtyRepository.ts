import { Specialty } from '../entities/Specialty.js';

export interface ISpecialtyRepository {
  save(specialty: Specialty): Promise<Specialty>;
  findById(id: string): Promise<Specialty | null>;
  findAll(): Promise<Specialty[]>;
}
