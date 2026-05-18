import { Controller, Post, Body, Get, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateSpecialtyUseCase } from '../../application/use-cases/CreateSpecialtyUseCase.js';
import { CreateSpecialtyRequestDTO } from './dto/CreateSpecialtyRequest.dto.js';
import { CreateDoctorUseCase } from '../../application/use-cases/CreateDoctorUseCase.js';
import { CreateDoctorRequestDTO } from './dto/CreateDoctorRequest.dto.js';
import { CreateDoctorAvailabilityUseCase } from '../../application/use-cases/CreateDoctorAvailabilityUseCase.js';
import { CreateAvailabilityRequestDTO } from './dto/CreateAvailabilityRequest.dto.js';
import { GetSpecialtiesUseCase } from '../../application/use-cases/GetSpecialtiesUseCase.js';
import { GetDoctorsBySpecialtyUseCase } from '../../application/use-cases/GetDoctorsBySpecialtyUseCase.js';
import { GetAvailableSlotsUseCase } from '../../application/use-cases/GetAvailableSlotsUseCase.js';
import { BookAppointmentUseCase } from '../../application/use-cases/BookAppointmentUseCase.js';
import { BookAppointmentRequestDTO } from './dto/BookAppointmentRequest.dto.js';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../../common/guards/roles.guard.js';
import { Roles } from '../../../../common/decorators/roles.decorator.js';
import { UserRole } from '../../../users/domain/entities/User.js';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
  constructor(
    private readonly createSpecialtyUseCase: CreateSpecialtyUseCase,
    private readonly createDoctorUseCase: CreateDoctorUseCase,
    private readonly createAvailabilityUseCase: CreateDoctorAvailabilityUseCase,
    private readonly getSpecialtiesUseCase: GetSpecialtiesUseCase,
    private readonly getDoctorsBySpecialtyUseCase: GetDoctorsBySpecialtyUseCase,
    private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCase,
    private readonly bookAppointmentUseCase: BookAppointmentUseCase,
  ) {}

  // ----------------------------------------------------
  // PATIENT & GENERAL ENDPOINTS (HU-02)
  // ----------------------------------------------------

  @Get('specialties')
  async getSpecialties() {
    return this.getSpecialtiesUseCase.execute();
  }

  @Get('doctors')
  async getDoctors(@Query('specialtyId') specialtyId: string) {
    return this.getDoctorsBySpecialtyUseCase.execute(specialtyId);
  }

  @Get('availabilities')
  async getAvailabilities(
    @Query('doctorId') doctorId: string,
    @Query('date') date?: string,
  ) {
    return this.getAvailableSlotsUseCase.execute(doctorId, date);
  }

  @Post('book')
  @Roles(UserRole.PATIENT, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async bookAppointment(@Req() req: any, @Body() dto: BookAppointmentRequestDTO) {
    // req.user is set by JwtStrategy and contains username (which is patient's email)
    const patientEmail = req.user.username;
    return this.bookAppointmentUseCase.execute({
      patientEmail,
      availabilityId: dto.availabilityId,
    });
  }

  // ----------------------------------------------------
  // ADMINISTRATIVE SETUP ENDPOINTS (HU-03 / HU-02 Setup)
  // ----------------------------------------------------

  @Post('specialties')
  @Roles(UserRole.ADMIN)
  async createSpecialty(@Body() dto: CreateSpecialtyRequestDTO) {
    return this.createSpecialtyUseCase.execute({
      name: dto.name,
      description: dto.description,
    });
  }

  @Post('doctors')
  @Roles(UserRole.ADMIN)
  async createDoctor(@Body() dto: CreateDoctorRequestDTO) {
    return this.createDoctorUseCase.execute({
      firstName: dto.firstName,
      lastName: dto.lastName,
      specialtyId: dto.specialtyId,
      email: dto.email,
      phone: dto.phone,
    });
  }

  @Post('availabilities')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createAvailability(@Body() dto: CreateAvailabilityRequestDTO) {
    return this.createAvailabilityUseCase.execute({
      doctorId: dto.doctorId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });
  }
}
