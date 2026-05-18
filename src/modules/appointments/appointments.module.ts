import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtyORMEntity } from './infrastructure/persistence/entities/SpecialtyORMEntity.js';
import { DoctorORMEntity } from './infrastructure/persistence/entities/DoctorORMEntity.js';
import { DoctorAvailabilityORMEntity } from './infrastructure/persistence/entities/DoctorAvailabilityORMEntity.js';
import { AppointmentORMEntity } from './infrastructure/persistence/entities/AppointmentORMEntity.js';

import { SpecialtyRepositoryORM } from './infrastructure/persistence/repositories/SpecialtyRepositoryORM.js';
import { DoctorRepositoryORM } from './infrastructure/persistence/repositories/DoctorRepositoryORM.js';
import { DoctorAvailabilityRepositoryORM } from './infrastructure/persistence/repositories/DoctorAvailabilityRepositoryORM.js';
import { AppointmentRepositoryORM } from './infrastructure/persistence/repositories/AppointmentRepositoryORM.js';

import { CreateSpecialtyUseCase } from './application/use-cases/CreateSpecialtyUseCase.js';
import { CreateDoctorUseCase } from './application/use-cases/CreateDoctorUseCase.js';
import { CreateDoctorAvailabilityUseCase } from './application/use-cases/CreateDoctorAvailabilityUseCase.js';
import { GetSpecialtiesUseCase } from './application/use-cases/GetSpecialtiesUseCase.js';
import { GetDoctorsBySpecialtyUseCase } from './application/use-cases/GetDoctorsBySpecialtyUseCase.js';
import { GetAvailableSlotsUseCase } from './application/use-cases/GetAvailableSlotsUseCase.js';
import { BookAppointmentUseCase } from './application/use-cases/BookAppointmentUseCase.js';

import { AppointmentController } from './infrastructure/controllers/AppointmentController.js';
import { UsersModule } from '../users/users.module.js';
import { PatientsModule } from '../patients/patients.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpecialtyORMEntity,
      DoctorORMEntity,
      DoctorAvailabilityORMEntity,
      AppointmentORMEntity,
    ]),
    UsersModule,
    PatientsModule,
  ],
  controllers: [AppointmentController],
  providers: [
    CreateSpecialtyUseCase,
    CreateDoctorUseCase,
    CreateDoctorAvailabilityUseCase,
    GetSpecialtiesUseCase,
    GetDoctorsBySpecialtyUseCase,
    GetAvailableSlotsUseCase,
    BookAppointmentUseCase,
    {
      provide: 'ISpecialtyRepository',
      useClass: SpecialtyRepositoryORM,
    },
    {
      provide: 'IDoctorRepository',
      useClass: DoctorRepositoryORM,
    },
    {
      provide: 'IDoctorAvailabilityRepository',
      useClass: DoctorAvailabilityRepositoryORM,
    },
    {
      provide: 'IAppointmentRepository',
      useClass: AppointmentRepositoryORM,
    },
  ],
  exports: [
    'ISpecialtyRepository',
    'IDoctorRepository',
    'IDoctorAvailabilityRepository',
    'IAppointmentRepository',
    CreateSpecialtyUseCase,
    CreateDoctorUseCase,
    CreateDoctorAvailabilityUseCase,
    GetSpecialtiesUseCase,
    GetDoctorsBySpecialtyUseCase,
    GetAvailableSlotsUseCase,
    BookAppointmentUseCase,
  ],
})
export class AppointmentsModule {}
