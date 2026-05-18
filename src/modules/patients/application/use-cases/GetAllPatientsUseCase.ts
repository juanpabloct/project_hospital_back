import { Inject, Injectable } from '@nestjs/common';
import type { IPatientRepository } from '../../domain/repositories/IPatientRepository.js';
import { Patient } from '../../domain/entities/Patient.js';

@Injectable()
export class GetAllPatientsUseCase {
  constructor(
    @Inject('IPatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(): Promise<Patient[]> {
    return this.patientRepository.findAll();
  }
}
