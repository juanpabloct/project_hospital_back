import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IDoctorAvailabilityRepository } from '../../domain/repositories/IDoctorAvailabilityRepository.js';
import type { IDoctorRepository } from '../../domain/repositories/IDoctorRepository.js';
import { DoctorAvailability } from '../../domain/entities/DoctorAvailability.js';
import { EntityNotFoundError } from '../../domain/exceptions/EntityNotFoundError.js';

export interface CreateDoctorAvailabilityInput {
  doctorId: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
}

@Injectable()
export class CreateDoctorAvailabilityUseCase {
  constructor(
    @Inject('IDoctorAvailabilityRepository')
    private readonly availabilityRepository: IDoctorAvailabilityRepository,
    @Inject('IDoctorRepository')
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(input: CreateDoctorAvailabilityInput): Promise<DoctorAvailability> {
    // 1. Verify Doctor exists
    const doctor = await this.doctorRepository.findById(input.doctorId);
    if (!doctor) {
      throw new EntityNotFoundError('Doctor', input.doctorId);
    }

    // 2. Create Availability domain model
    const dateObj = new Date(input.date);
    const availability = DoctorAvailability.create(
      randomUUID(),
      input.doctorId,
      dateObj,
      input.startTime,
      input.endTime,
      false, // isBooked starts as false
    );

    return this.availabilityRepository.save(availability);
  }
}
