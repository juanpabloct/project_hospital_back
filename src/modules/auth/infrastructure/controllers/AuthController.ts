import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase.js';
import { LoginRequestDTO } from './dto/LoginRequest.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDTO) {
    return this.loginUseCase.execute({
      username: dto.username,
      password: dto.password,
    });
  }
}
