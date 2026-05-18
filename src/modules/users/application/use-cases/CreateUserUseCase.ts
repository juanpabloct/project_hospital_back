import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import type { IPasswordHasher } from '../interfaces/IPasswordHasher.js';
import { User, UserRole } from '../../domain/entities/User.js';
import { UserAlreadyExistsError } from '../../domain/exceptions/UserAlreadyExistsError.js';

export interface CreateUserDTO {
  username: string;
  passwordHash: string; // Wait, actually the input is raw password
  role: UserRole;
}

// In case we want to rename the parameter for clarity
export interface CreateUserInput {
  username: string;
  password: string;
  role: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(input.username);
    if (existingUser) {
      throw new UserAlreadyExistsError(input.username);
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    const user = User.create(
      randomUUID(),
      input.username,
      hashedPassword,
      input.role,
    );

    return this.userRepository.save(user);
  }
}
