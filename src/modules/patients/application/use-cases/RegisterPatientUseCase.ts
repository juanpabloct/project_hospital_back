import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IPatientRepository } from '../../domain/repositories/IPatientRepository.js';
import { Patient } from '../../domain/entities/Patient.js';
import { PatientAlreadyExistsError } from '../../domain/exceptions/PatientAlreadyExistsError.js';
import type { IUserRepository } from '../../../users/domain/repositories/IUserRepository.js';
import type { IPasswordHasher } from '../../../users/application/interfaces/IPasswordHasher.js';
import { User, UserRole } from '../../../users/domain/entities/User.js';
import { UserAlreadyExistsError } from '../../../users/domain/exceptions/UserAlreadyExistsError.js';

export interface RegisterPatientInput {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  eps: string;
}

@Injectable()
export class RegisterPatientUseCase {
  constructor(
    @Inject('IPatientRepository')
    private readonly patientRepository: IPatientRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: RegisterPatientInput): Promise<Patient> {
    // 1. Verify patient uniqueness
    const existingPatient = await this.patientRepository.findByDocument(
      input.documentType,
      input.documentNumber,
    );
    if (existingPatient) {
      throw new PatientAlreadyExistsError(input.documentType, input.documentNumber);
    }

    // 2. Verify username uniqueness for the user account
    const existingUser = await this.userRepository.findByUsername(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(input.email);
    }

    // 3. Create and Save Patient domain entity
    const patientId = randomUUID();
    const patient = Patient.create(
      patientId,
      input.firstName,
      input.lastName,
      input.documentType,
      input.documentNumber,
      input.email,
      input.phone,
      input.eps,
    );
    const savedPatient = await this.patientRepository.save(patient);

    // 4. Create and Save corresponding User account
    const passwordHash = await this.passwordHasher.hash(input.documentNumber);
    const user = User.create(
      randomUUID(),
      input.email, // email as username for patient portal
      passwordHash,
      UserRole.PATIENT,
    );
    await this.userRepository.save(user);

    return savedPatient;
  }
}
