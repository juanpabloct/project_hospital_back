import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateDoctorRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'La especialidad es obligatoria.' })
  specialtyId: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  phone: string;
}
