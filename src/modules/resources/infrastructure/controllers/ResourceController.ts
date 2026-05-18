import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateResourceUseCase } from '../../application/use-cases/CreateResourceUseCase.js';
import { CreateResourceRequestDTO } from './dto/CreateResourceRequest.dto.js';
import { UpdateResourceUseCase } from '../../application/use-cases/UpdateResourceUseCase.js';
import { UpdateResourceRequestDTO } from './dto/UpdateResourceRequest.dto.js';
import { DeleteResourceUseCase } from '../../application/use-cases/DeleteResourceUseCase.js';
import { GetResourcesUseCase } from '../../application/use-cases/GetResourcesUseCase.js';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../../common/guards/roles.guard.js';
import { Roles } from '../../../../common/decorators/roles.decorator.js';
import { UserRole } from '../../../users/domain/entities/User.js';

@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN) // Restricted to ADMIN only
export class ResourceController {
  constructor(
    private readonly createResourceUseCase: CreateResourceUseCase,
    private readonly updateResourceUseCase: UpdateResourceUseCase,
    private readonly deleteResourceUseCase: DeleteResourceUseCase,
    private readonly getResourcesUseCase: GetResourcesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createResource(@Body() dto: CreateResourceRequestDTO) {
    return this.createResourceUseCase.execute({
      name: dto.name,
      type: dto.type,
      quantity: dto.quantity,
      description: dto.description || '',
      location: dto.location,
    });
  }

  @Get()
  async getAllResources() {
    return this.getResourcesUseCase.executeAll();
  }

  @Get(':id')
  async getResourceById(@Param('id') id: string) {
    return this.getResourcesUseCase.executeOne(id);
  }

  @Put(':id')
  async updateResource(@Param('id') id: string, @Body() dto: UpdateResourceRequestDTO) {
    return this.updateResourceUseCase.execute({
      id,
      name: dto.name,
      type: dto.type,
      quantity: dto.quantity,
      description: dto.description,
      location: dto.location,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteResource(@Param('id') id: string) {
    await this.deleteResourceUseCase.execute(id);
  }
}
