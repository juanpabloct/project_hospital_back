import { IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../../../domain/entities/User.js';

export class CreateUserRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío.' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de los siguientes: ADMIN, RECEPTIONIST, DOCTOR, PATIENT.',
  })
  role: UserRole;
}
