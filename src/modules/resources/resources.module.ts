import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceORMEntity } from './infrastructure/persistence/entities/ResourceORMEntity.js';
import { ResourceRepositoryORM } from './infrastructure/persistence/repositories/ResourceRepositoryORM.js';
import { CreateResourceUseCase } from './application/use-cases/CreateResourceUseCase.js';
import { UpdateResourceUseCase } from './application/use-cases/UpdateResourceUseCase.js';
import { DeleteResourceUseCase } from './application/use-cases/DeleteResourceUseCase.js';
import { GetResourcesUseCase } from './application/use-cases/GetResourcesUseCase.js';
import { ResourceController } from './infrastructure/controllers/ResourceController.js';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceORMEntity])],
  controllers: [ResourceController],
  providers: [
    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    GetResourcesUseCase,
    {
      provide: 'IResourceRepository',
      useClass: ResourceRepositoryORM,
    },
  ],
  exports: [
    'IResourceRepository',
    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    GetResourcesUseCase,
  ],
})
export class ResourcesModule {}
