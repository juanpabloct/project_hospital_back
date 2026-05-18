import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterPatientRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio.' })
  documentType: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de documento es obligatorio.' })
  documentNumber: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'La EPS es obligatoria.' })
  eps: string;
}
