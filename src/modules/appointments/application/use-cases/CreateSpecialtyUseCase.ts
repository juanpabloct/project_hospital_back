import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { ISpecialtyRepository } from '../../domain/repositories/ISpecialtyRepository.js';
import { Specialty } from '../../domain/entities/Specialty.js';

export interface CreateSpecialtyInput {
  name: string;
  description: string;
}

@Injectable()
export class CreateSpecialtyUseCase {
  constructor(
    @Inject('ISpecialtyRepository')
    private readonly specialtyRepository: ISpecialtyRepository,
  ) {}

  async execute(input: CreateSpecialtyInput): Promise<Specialty> {
    const specialty = Specialty.create(randomUUID(), input.name, input.description);
    return this.specialtyRepository.save(specialty);
  }
}
