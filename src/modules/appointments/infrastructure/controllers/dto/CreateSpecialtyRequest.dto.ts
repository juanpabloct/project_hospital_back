import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSpecialtyRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la especialidad es obligatorio.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción de la especialidad es obligatoria.' })
  description: string;
}
