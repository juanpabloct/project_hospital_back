import { Inject, Injectable } from '@nestjs/common';
import type { IResourceRepository } from '../../domain/repositories/IResourceRepository.js';
import { Resource, ResourceType } from '../../domain/entities/Resource.js';
import { ResourceNotFoundError } from '../../domain/exceptions/ResourceNotFoundError.js';

export interface UpdateResourceInput {
  id: string;
  name?: string;
  type?: ResourceType;
  quantity?: number;
  description?: string;
  location?: string;
}

@Injectable()
export class UpdateResourceUseCase {
  constructor(
    @Inject('IResourceRepository')
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(input: UpdateResourceInput): Promise<Resource> {
    const existing = await this.resourceRepository.findById(input.id);
    if (!existing) {
      throw new ResourceNotFoundError(input.id);
    }

    const updated = Resource.create(
      existing.id,
      input.name !== undefined ? input.name : existing.name,
      input.type !== undefined ? input.type : existing.type,
      input.quantity !== undefined ? input.quantity : existing.quantity,
      input.description !== undefined ? input.description : existing.description,
      input.location !== undefined ? input.location : existing.location,
    );

    return this.resourceRepository.save(updated);
  }
}
