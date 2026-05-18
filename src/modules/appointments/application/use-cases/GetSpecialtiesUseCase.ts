import { Inject, Injectable } from '@nestjs/common';
import type { ISpecialtyRepository } from '../../domain/repositories/ISpecialtyRepository.js';
import { Specialty } from '../../domain/entities/Specialty.js';

@Injectable()
export class GetSpecialtiesUseCase {
  constructor(
    @Inject('ISpecialtyRepository')
    private readonly specialtyRepository: ISpecialtyRepository,
  ) {}

  async execute(): Promise<Specialty[]> {
    return this.specialtyRepository.findAll();
  }
}
