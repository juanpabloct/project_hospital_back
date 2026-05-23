import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import type { IMedicalHistoryRepository } from '../../domain/repositories/IMedicalHistoryRepository.js';
import type { IPatientRepository } from '../../../patients/domain/repositories/IPatientRepository.js';
import { MedicalHistoryRecord } from '../../domain/entities/MedicalHistoryRecord.js';
import { UserRole } from '../../../users/domain/entities/User.js';
import { EntityNotFoundError } from '../../../appointments/domain/exceptions/EntityNotFoundError.js';

export interface GetPatientMedicalHistoryInput {
  patientId: string;
  requesterEmail: string;
  requesterRole: string;
}

@Injectable()
export class GetPatientMedicalHistoryUseCase {
  constructor(
    @Inject('IMedicalHistoryRepository')
    private readonly medicalHistoryRepository: IMedicalHistoryRepository,
    @Inject('IPatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(input: GetPatientMedicalHistoryInput): Promise<MedicalHistoryRecord[]> {
    // 1. Verify patient exists
    const patient = await this.patientRepository.findById(input.patientId);
    if (!patient) {
      throw new EntityNotFoundError('Patient', input.patientId);
    }

    // 2. Validate permissions
    if (input.requesterRole === UserRole.PATIENT) {
      const selfPatient = await this.patientRepository.findByEmail(input.requesterEmail);
      if (!selfPatient || selfPatient.id !== input.patientId) {
        throw new ForbiddenException('No tiene permisos para acceder al historial médico de otro paciente.');
      }
    } else if (input.requesterRole !== UserRole.ADMIN && input.requesterRole !== UserRole.DOCTOR) {
      throw new ForbiddenException('No tiene permisos para acceder al historial médico.');
    }

    // 3. Return history
    return this.medicalHistoryRepository.findByPatientId(input.patientId);
  }
}
