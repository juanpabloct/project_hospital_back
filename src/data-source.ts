import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserORMEntity } from './modules/users/infrastructure/persistence/entities/UserORMEntity.js';
import { PatientORMEntity } from './modules/patients/infrastructure/persistence/entities/PatientORMEntity.js';
import { SpecialtyORMEntity } from './modules/appointments/infrastructure/persistence/entities/SpecialtyORMEntity.js';
import { DoctorORMEntity } from './modules/appointments/infrastructure/persistence/entities/DoctorORMEntity.js';
import { DoctorAvailabilityORMEntity } from './modules/appointments/infrastructure/persistence/entities/DoctorAvailabilityORMEntity.js';
import { AppointmentORMEntity } from './modules/appointments/infrastructure/persistence/entities/AppointmentORMEntity.js';
import { ResourceORMEntity } from './modules/resources/infrastructure/persistence/entities/ResourceORMEntity.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'hospital_user',
  password: process.env.DB_PASSWORD || 'hospital_password',
  database: process.env.DB_DATABASE || 'hospital_db',
  synchronize: true,
  logging: true,
  entities: [
    UserORMEntity,
    PatientORMEntity,
    SpecialtyORMEntity,
    DoctorORMEntity,
    DoctorAvailabilityORMEntity,
    AppointmentORMEntity,
    ResourceORMEntity,
  ],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
