import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { PatientsModule } from './modules/patients/patients.module.js';
import { AppointmentsModule } from './modules/appointments/appointments.module.js';
import { ResourcesModule } from './modules/resources/resources.module.js';
import { MedicalHistoriesModule } from './modules/medical-histories/medical-histories.module.js';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Dynamic Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'hospital_user',
        password: configService.get<string>('DB_PASSWORD') || 'hospital_password',
        database: configService.get<string>('DB_DATABASE') || 'hospital_db',
        autoLoadEntities: true,
        synchronize: true, // Development mode: auto-create schemas on startup
      }),
    }),
    // Feature Modules
    UsersModule,
    AuthModule,
    PatientsModule,
    AppointmentsModule,
    ResourcesModule,
    MedicalHistoriesModule,
  ],
})
export class AppModule {}
