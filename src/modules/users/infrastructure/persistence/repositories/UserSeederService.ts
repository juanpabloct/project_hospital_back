import { Injectable, OnApplicationBootstrap, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import type { IPasswordHasher } from '../../../application/interfaces/IPasswordHasher.js';
import { User, UserRole } from '../../../domain/entities/User.js';

@Injectable()
export class UserSeederService implements OnApplicationBootstrap {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async onApplicationBootstrap() {
    try {
      const users = await this.userRepository.findAll();
      if (users.length === 0) {
        console.log('🌱 Base de datos vacía. Creando administrador inicial por defecto...');
        const adminId = randomUUID();
        const hashedPassword = await this.passwordHasher.hash('adminpassword');
        const admin = User.create(
          adminId,
          'admin@hospital.com',
          hashedPassword,
          UserRole.ADMIN,
        );
        await this.userRepository.save(admin);
        console.log('✨ Administrador creado con éxito!');
        console.log('📧 Usuario: admin@hospital.com');
        console.log('🔑 Contraseña: adminpassword');
        console.log('--------------------------------------------------');
      } else {
        console.log(`📊 Base de datos inicializada. Total de usuarios registrados: ${users.length}`);
      }
    } catch (error) {
      console.error('❌ Error al sembrar el administrador inicial:', error);
    }
  }
}
