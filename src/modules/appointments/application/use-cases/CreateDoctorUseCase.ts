import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IDoctorRepository } from '../../domain/repositories/IDoctorRepository.js';
import type { ISpecialtyRepository } from '../../domain/repositories/ISpecialtyRepository.js';
import { Doctor } from '../../domain/entities/Doctor.js';
import { EntityNotFoundError } from '../../domain/exceptions/EntityNotFoundError.js';
import type { IUserRepository } from '../../../users/domain/repositories/IUserRepository.js';
import type { IPasswordHasher } from '../../../users/application/interfaces/IPasswordHasher.js';
import { User, UserRole } from '../../../users/domain/entities/User.js';
import { UserAlreadyExistsError } from '../../../users/domain/exceptions/UserAlreadyExistsError.js';

export interface CreateDoctorInput {
  firstName: string;
  lastName: string;
  specialtyId: string;
  email: string;
  phone: string;
}

@Injectable()
export class CreateDoctorUseCase {
  constructor(
    @Inject('IDoctorRepository')
    private readonly doctorRepository: IDoctorRepository,
    @Inject('ISpecialtyRepository')
    private readonly specialtyRepository: ISpecialtyRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: CreateDoctorInput): Promise<Doctor> {
    // 1. Verify Specialty exists
    const specialty = await this.specialtyRepository.findById(input.specialtyId);
    if (!specialty) {
      throw new EntityNotFoundError('Specialty', input.specialtyId);
    }

    // 2. Verify email uniqueness
    const existingUser = await this.userRepository.findByUsername(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(input.email);
    }

    // 3. Create User account for Doctor
    const userId = randomUUID();
    const passwordHash = await this.passwordHasher.hash(input.phone); // Phone as temporary password
    const user = User.create(
      userId,
      input.email,
      passwordHash,
      UserRole.DOCTOR,
    );
    await this.userRepository.save(user);

    // 4. Create and Save Doctor record
    const doctor = Doctor.create(
      randomUUID(),
      input.firstName,
      input.lastName,
      input.specialtyId,
      input.email,
      input.phone,
      userId,
    );
    return this.doctorRepository.save(doctor);
  }
}
