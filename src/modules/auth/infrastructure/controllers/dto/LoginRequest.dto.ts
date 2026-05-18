import { IsString, IsNotEmpty } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario/correo es obligatorio.' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password: string;
}
