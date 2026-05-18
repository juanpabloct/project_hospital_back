import { Inject, Injectable } from '@nestjs/common';
import { ValidateUserUseCase } from '../../../users/application/use-cases/ValidateUserUseCase.js';
import type { ITokenService } from '../interfaces/ITokenService.js';
import { InvalidCredentialsError } from '../../domain/exceptions/InvalidCredentialsError.js';

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly validateUserUseCase: ValidateUserUseCase,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.validateUserUseCase.execute(input.username, input.password);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenService.generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
