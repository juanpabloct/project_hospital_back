import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IMedicalHistoryRepository } from '../../domain/repositories/IMedicalHistoryRepository.js';
import type { IDoctorRepository } from '../../../appointments/domain/repositories/IDoctorRepository.js';
import type { IPatientRepository } from '../../../patients/domain/repositories/IPatientRepository.js';
import { MedicalHistoryRecord, MedicalHistorySupply } from '../../domain/entities/MedicalHistoryRecord.js';
import { EntityNotFoundError } from '../../../appointments/domain/exceptions/EntityNotFoundError.js';
import { UserRole } from '../../../users/domain/entities/User.js';

export interface CreateMedicalHistoryInput {
  patientId: string;
  doctorUserId: string;
  requesterRole: string;
  doctorId?: string;
  appointmentId?: string | null;
  diagnosis: string;
  treatment: string;
  supplies: { resourceId: string; quantity: number }[];
}

@Injectable()
export class CreateMedicalHistoryUseCase {
  constructor(
    @Inject('IMedicalHistoryRepository')
    private readonly medicalHistoryRepository: IMedicalHistoryRepository,
    @Inject('IDoctorRepository')
    private readonly doctorRepository: IDoctorRepository,
    @Inject('IPatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(input: CreateMedicalHistoryInput): Promise<MedicalHistoryRecord> {
    // 1. Verify Patient exists
    const patient = await this.patientRepository.findById(input.patientId);
    if (!patient) {
      throw new EntityNotFoundError('Patient', input.patientId);
    }

    // 2. Resolve Doctor ID
    let resolvedDoctorId: string;
    if (input.requesterRole === UserRole.ADMIN && input.doctorId) {
      const doctor = await this.doctorRepository.findById(input.doctorId);
      if (!doctor) {
        throw new EntityNotFoundError('Doctor', input.doctorId);
      }
      resolvedDoctorId = doctor.id;
    } else {
      const doctor = await this.doctorRepository.findByUserId(input.doctorUserId);
      if (!doctor) {
        throw new EntityNotFoundError('Doctor', input.doctorUserId);
      }
      resolvedDoctorId = doctor.id;
    }

    // 3. Map input supplies to Domain MedicalHistorySupply (set empty name initially as it is saved by ID and loaded with name from DB)
    const domainSupplies = input.supplies.map(
      (s) => new MedicalHistorySupply(s.resourceId, '', s.quantity),
    );

    // 4. Create and save Medical History domain entity (delegating transactional deduction to repo)
    const recordId = randomUUID();
    const record = MedicalHistoryRecord.create(
      recordId,
      patient.id,
      resolvedDoctorId,
      input.appointmentId || null,
      input.diagnosis,
      input.treatment,
      domainSupplies,
    );

    return this.medicalHistoryRepository.save(record);
  }
}
