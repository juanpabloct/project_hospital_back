import { Inject, Injectable } from '@nestjs/common';
import type { IResourceRepository } from '../../domain/repositories/IResourceRepository.js';
import { ResourceNotFoundError } from '../../domain/exceptions/ResourceNotFoundError.js';

@Injectable()
export class DeleteResourceUseCase {
  constructor(
    @Inject('IResourceRepository')
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.resourceRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError(id);
    }
    await this.resourceRepository.delete(id);
  }
}
