import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { UserRole } from '../../modules/users/domain/entities/User.js';
import type { IUserRepository } from '../../modules/users/domain/repositories/IUserRepository.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if any admin exists in the database
    const admin = await this.userRepository.findByRole(UserRole.ADMIN);
    const adminExists = admin !== null;

    const request = context.switchToHttp().getRequest();

    if (!adminExists) {
      // Bootstrap mode: only bypass roles guard if creating the first ADMIN user
      const isCreateUser = request.method === 'POST' && request.url.includes('/users');
      const body = request.body;
      if (isCreateUser && body && body.role === UserRole.ADMIN) {
        return true;
      }
    }

    const user = request.user;
    console.log('🔍 [RolesGuard] User:', user, 'Required Roles:', requiredRoles);

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
