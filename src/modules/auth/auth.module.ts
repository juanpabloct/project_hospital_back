import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './infrastructure/controllers/AuthController.js';
import { LoginUseCase } from './application/use-cases/LoginUseCase.js';
import { JwtTokenService } from './infrastructure/security/JwtTokenService.js';
import { JwtStrategy } from './infrastructure/security/JwtStrategy.js';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'super_secret_hospital_jwt_key_12345',
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRATION') || '24h') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtStrategy,
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
  ],
  exports: [
    PassportModule,
    JwtStrategy,
    'ITokenService',
  ],
})
export class AuthModule {}
