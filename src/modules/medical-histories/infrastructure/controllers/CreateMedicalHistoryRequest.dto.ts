import { IsString, IsNotEmpty, IsUUID, IsOptional, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SupplyItemDTO {
  @IsUUID('4', { message: 'El id del recurso debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El id del recurso es obligatorio.' })
  resourceId: string;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser al menos 1.' })
  quantity: number;
}

export class CreateMedicalHistoryRequestDTO {
  @IsUUID('4', { message: 'El id del paciente debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El id del paciente es obligatorio.' })
  patientId: string;

  @IsUUID('4', { message: 'El id del médico debe ser un UUID válido.' })
  @IsOptional()
  doctorId?: string;

  @IsUUID('4', { message: 'El id de la cita debe ser un UUID válido.' })
  @IsOptional()
  appointmentId?: string;

  @IsString()
  @IsNotEmpty({ message: 'El diagnóstico es obligatorio.' })
  diagnosis: string;

  @IsString()
  @IsNotEmpty({ message: 'El tratamiento es obligatorio.' })
  treatment: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SupplyItemDTO)
  supplies?: SupplyItemDTO[];
}
