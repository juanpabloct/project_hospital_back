import { Inject, Injectable } from '@nestjs/common';
import type { IResourceRepository } from '../../domain/repositories/IResourceRepository.js';
import { Resource } from '../../domain/entities/Resource.js';
import { ResourceNotFoundError } from '../../domain/exceptions/ResourceNotFoundError.js';

@Injectable()
export class GetResourcesUseCase {
  constructor(
    @Inject('IResourceRepository')
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async executeAll(): Promise<Resource[]> {
    return this.resourceRepository.findAll();
  }

  async executeOne(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new ResourceNotFoundError(id);
    }
    return resource;
  }
}
