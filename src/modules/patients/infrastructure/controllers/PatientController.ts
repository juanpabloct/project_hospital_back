import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { RegisterPatientUseCase } from '../../application/use-cases/RegisterPatientUseCase.js';
import { GetAllPatientsUseCase } from '../../application/use-cases/GetAllPatientsUseCase.js';
import { RegisterPatientRequestDTO } from './dto/RegisterPatientRequest.dto.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../../common/guards/roles.guard.js';
import { Roles } from '../../../../common/decorators/roles.decorator.js';
import { UserRole } from '../../../users/domain/entities/User.js';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(
    private readonly registerPatientUseCase: RegisterPatientUseCase,
    private readonly getAllPatientsUseCase: GetAllPatientsUseCase,
  ) {}

  @Post()
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN)
  async registerPatient(@Body() dto: RegisterPatientRequestDTO) {
    return this.registerPatientUseCase.execute({
      firstName: dto.firstName,
      lastName: dto.lastName,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      email: dto.email,
      phone: dto.phone,
      eps: dto.eps,
    });
  }

  @Get()
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN)
  async getAllPatients() {
    return this.getAllPatientsUseCase.execute();
  }
}
