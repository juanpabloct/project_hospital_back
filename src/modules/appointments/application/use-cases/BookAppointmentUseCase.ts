import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository.js';
import type { IPatientRepository } from '../../../patients/domain/repositories/IPatientRepository.js';
import { Appointment } from '../../domain/entities/Appointment.js';
import { EntityNotFoundError } from '../../domain/exceptions/EntityNotFoundError.js';

export interface BookAppointmentInput {
  patientEmail: string; // The email of the patient (from JWT username)
  availabilityId: string; // The availability slot to book
}

@Injectable()
export class BookAppointmentUseCase {
  constructor(
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject('IPatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(input: BookAppointmentInput): Promise<Appointment> {
    // 1. Fetch Patient record linked to the authenticated user's email
    // Patient email matches their user account username
    const patient = await this.patientRepository.findAll().then(patients => 
      patients.find(p => p.email.toLowerCase() === input.patientEmail.toLowerCase())
    );

    if (!patient) {
      throw new EntityNotFoundError('Patient', input.patientEmail);
    }

    // 2. Delegate secure atomic transactional booking to the infrastructure layer
    const appointmentId = randomUUID();
    return this.appointmentRepository.bookAppointment(
      patient.id,
      input.availabilityId,
      appointmentId,
    );
  }
}
