import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { IUserRepository } from '../../modules/users/domain/repositories/IUserRepository.js';

import { UserRole } from '../../modules/users/domain/entities/User.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check if any admin exists in the database
    const admin = await this.userRepository.findByRole(UserRole.ADMIN);
    const adminExists = admin !== null;

    if (!adminExists) {
      // Bootstrap mode: only bypass authentication if creating the first ADMIN user
      const isCreateUser = context.getClass().name === 'UserController' && context.getHandler().name === 'createUser';
      const body = request.body;
      if (isCreateUser && body && body.role === UserRole.ADMIN) {
        return true;
      }
    }

    const result = super.canActivate(context);
    if (result instanceof Promise) {
      return await result;
    }
    const PromiseOrObservable = result as any;
    if (PromiseOrObservable && typeof PromiseOrObservable.toPromise === 'function') {
      return await PromiseOrObservable.toPromise();
    }
    return result as boolean;
  }
}
