import { Controller, Post, Body, Get, Param, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateMedicalHistoryUseCase } from '../../application/use-cases/CreateMedicalHistoryUseCase.js';
import { GetPatientMedicalHistoryUseCase } from '../../application/use-cases/GetPatientMedicalHistoryUseCase.js';
import { CreateMedicalHistoryRequestDTO } from './CreateMedicalHistoryRequest.dto.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../../common/guards/roles.guard.js';
import { Roles } from '../../../../common/decorators/roles.decorator.js';
import { UserRole } from '../../../users/domain/entities/User.js';

@Controller('medical-histories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalHistoryController {
  constructor(
    private readonly createUseCase: CreateMedicalHistoryUseCase,
    private readonly getPatientHistoryUseCase: GetPatientMedicalHistoryUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  async createRecord(@Req() req: any, @Body() dto: CreateMedicalHistoryRequestDTO) {
    return this.createUseCase.execute({
      patientId: dto.patientId,
      doctorUserId: req.user.id,
      requesterRole: req.user.role,
      doctorId: dto.doctorId,
      appointmentId: dto.appointmentId,
      diagnosis: dto.diagnosis,
      treatment: dto.treatment,
      supplies: dto.supplies || [],
    });
  }

  @Get('patient/:patientId')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  async getPatientHistory(@Req() req: any, @Param('patientId') patientId: string) {
    return this.getPatientHistoryUseCase.execute({
      patientId,
      requesterEmail: req.user.username,
      requesterRole: req.user.role,
    });
  }
}
