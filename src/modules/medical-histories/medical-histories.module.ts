import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistoryRecordORMEntity } from './infrastructure/persistence/entities/MedicalHistoryRecordORMEntity.js';
import { MedicalHistorySupplyORMEntity } from './infrastructure/persistence/entities/MedicalHistorySupplyORMEntity.js';
import { MedicalHistoryRepositoryORM } from './infrastructure/persistence/repositories/MedicalHistoryRepositoryORM.js';
import { CreateMedicalHistoryUseCase } from './application/use-cases/CreateMedicalHistoryUseCase.js';
import { GetPatientMedicalHistoryUseCase } from './application/use-cases/GetPatientMedicalHistoryUseCase.js';
import { MedicalHistoryController } from './infrastructure/controllers/MedicalHistoryController.js';
import { PatientsModule } from '../patients/patients.module.js';
import { AppointmentsModule } from '../appointments/appointments.module.js';
import { ResourcesModule } from '../resources/resources.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalHistoryRecordORMEntity, MedicalHistorySupplyORMEntity]),
    PatientsModule,
    AppointmentsModule,
    ResourcesModule,
    UsersModule,
  ],
  controllers: [MedicalHistoryController],
  providers: [
    CreateMedicalHistoryUseCase,
    GetPatientMedicalHistoryUseCase,
    {
      provide: 'IMedicalHistoryRepository',
      useClass: MedicalHistoryRepositoryORM,
    },
  ],
  exports: [
    'IMedicalHistoryRepository',
    CreateMedicalHistoryUseCase,
    GetPatientMedicalHistoryUseCase,
  ],
})
export class MedicalHistoriesModule {}
