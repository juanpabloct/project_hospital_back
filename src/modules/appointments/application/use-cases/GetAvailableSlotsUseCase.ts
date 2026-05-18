import { Inject, Injectable } from '@nestjs/common';
import type { IDoctorAvailabilityRepository } from '../../domain/repositories/IDoctorAvailabilityRepository.js';
import { DoctorAvailability } from '../../domain/entities/DoctorAvailability.js';

@Injectable()
export class GetAvailableSlotsUseCase {
  constructor(
    @Inject('IDoctorAvailabilityRepository')
    private readonly availabilityRepository: IDoctorAvailabilityRepository,
  ) {}

  async execute(doctorId: string, dateString?: string): Promise<DoctorAvailability[]> {
    const date = dateString ? new Date(dateString) : undefined;
    return this.availabilityRepository.findAvailableByDoctor(doctorId, date);
  }
}
