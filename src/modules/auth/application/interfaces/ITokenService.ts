export interface ITokenService {
  generateToken(payload: { userId: string; username: string; role: string }): string;
}
