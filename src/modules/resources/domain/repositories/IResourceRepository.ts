import { Resource } from '../entities/Resource.js';

export interface IResourceRepository {
  save(resource: Resource): Promise<Resource>;
  findById(id: string): Promise<Resource | null>;
  findAll(): Promise<Resource[]>;
  delete(id: string): Promise<void>;
}
