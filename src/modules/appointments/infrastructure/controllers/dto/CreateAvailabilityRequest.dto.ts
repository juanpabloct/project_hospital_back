import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateAvailabilityRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El ID del médico es obligatorio.' })
  doctorId: string;

  @IsString()
  @IsNotEmpty({ message: 'La fecha (AAAA-MM-DD) es obligatoria.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe estar en formato AAAA-MM-DD.' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria.' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'La hora de inicio debe estar en formato HH:MM.' })
  startTime: string;

  @IsString()
  @IsNotEmpty({ message: 'La hora de fin es obligatoria.' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'La hora de fin debe estar en formato HH:MM.' })
  endTime: string;
}
