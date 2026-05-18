import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/domain/entities/User.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
