import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientORMEntity } from './infrastructure/persistence/entities/PatientORMEntity.js';
import { PatientRepositoryORM } from './infrastructure/persistence/repositories/PatientRepositoryORM.js';
import { RegisterPatientUseCase } from './application/use-cases/RegisterPatientUseCase.js';
import { GetAllPatientsUseCase } from './application/use-cases/GetAllPatientsUseCase.js';
import { PatientController } from './infrastructure/controllers/PatientController.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientORMEntity]),
    UsersModule, // Needed to access IUserRepository and IPasswordHasher
  ],
  controllers: [PatientController],
  providers: [
    RegisterPatientUseCase,
    GetAllPatientsUseCase,
    {
      provide: 'IPatientRepository',
      useClass: PatientRepositoryORM,
    },
  ],
  exports: [
    'IPatientRepository',
    RegisterPatientUseCase,
    GetAllPatientsUseCase,
  ],
})
export class PatientsModule {}
