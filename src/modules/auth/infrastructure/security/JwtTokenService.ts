import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../application/interfaces/ITokenService.js';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: { userId: string; username: string; role: string }): string {
    return this.jwtService.sign(payload);
  }
}
