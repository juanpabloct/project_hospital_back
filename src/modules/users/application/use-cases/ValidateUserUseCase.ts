import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import type { IPasswordHasher } from '../interfaces/IPasswordHasher.js';
import { User } from '../../domain/entities/User.js';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
