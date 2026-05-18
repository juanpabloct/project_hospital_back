import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserORMEntity } from './infrastructure/persistence/entities/UserORMEntity.js';
import { UserRepositoryORM } from './infrastructure/persistence/repositories/UserRepositoryORM.js';
import { BcryptPasswordHasher } from './infrastructure/security/BcryptPasswordHasher.js';
import { CreateUserUseCase } from './application/use-cases/CreateUserUseCase.js';
import { ValidateUserUseCase } from './application/use-cases/ValidateUserUseCase.js';
import { UserController } from './infrastructure/controllers/UserController.js';
import { UserSeederService } from './infrastructure/persistence/repositories/UserSeederService.js';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserORMEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    ValidateUserUseCase,
    UserSeederService,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryORM,
    },
    {
      provide: 'IPasswordHasher',
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [
    'IUserRepository',
    'IPasswordHasher',
    ValidateUserUseCase,
  ],
})
export class UsersModule {}
