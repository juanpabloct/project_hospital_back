import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IResourceRepository } from '../../domain/repositories/IResourceRepository.js';
import { Resource, ResourceType } from '../../domain/entities/Resource.js';

export interface CreateResourceInput {
  name: string;
  type: ResourceType;
  quantity: number;
  description: string;
  location: string;
}

@Injectable()
export class CreateResourceUseCase {
  constructor(
    @Inject('IResourceRepository')
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(input: CreateResourceInput): Promise<Resource> {
    const resource = Resource.create(
      randomUUID(),
      input.name,
      input.type,
      input.quantity,
      input.description,
      input.location,
    );
    return this.resourceRepository.save(resource);
  }
}
