export class UserAlreadyExistsError extends Error {
  constructor(username: string) {
    super(`El usuario con el nombre de usuario/correo '${username}' ya está registrado.`);
    this.name = 'UserAlreadyExistsError';
  }
}
