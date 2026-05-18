import { Inject, Injectable } from '@nestjs/common';
import type { IDoctorRepository } from '../../domain/repositories/IDoctorRepository.js';
import { Doctor } from '../../domain/entities/Doctor.js';

@Injectable()
export class GetDoctorsBySpecialtyUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(specialtyId: string): Promise<Doctor[]> {
    return this.doctorRepository.findBySpecialty(specialtyId);
  }
}
