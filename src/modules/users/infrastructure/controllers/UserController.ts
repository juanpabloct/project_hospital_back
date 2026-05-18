import { Controller, Post, Body, Get, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase.js';
import { CreateUserRequestDTO } from './dto/CreateUserRequest.dto.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../../common/guards/roles.guard.js';
import { Roles } from '../../../../common/decorators/roles.decorator.js';
import { UserRole } from '../../domain/entities/User.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async createUser(@Body() dto: CreateUserRequestDTO, @Req() req: any) {
    const currentUser = req.user;

    // A Receptionist is only allowed to create PATIENT users directly
    if (currentUser && currentUser.role === UserRole.RECEPTIONIST && dto.role !== UserRole.PATIENT) {
      throw new ForbiddenException('Los recepcionistas solo pueden crear usuarios con rol PACIENTE.');
    }

    const user = await this.createUserUseCase.execute({
      username: dto.username,
      password: dto.password,
      role: dto.role,
    });
    
    // Return user without password hash
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Get('me')
  async getProfile(@Req() req: any) {
    const user = req.user;
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
