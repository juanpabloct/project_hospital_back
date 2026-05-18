import { IsString, IsNotEmpty, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { ResourceType } from '../../../domain/entities/Resource.js';

export class CreateResourceRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del recurso es obligatorio.' })
  name: string;

  @IsEnum(ResourceType, {
    message: 'El tipo debe ser MEDICINE, CLOTHING o EQUIPMENT.',
  })
  type: ResourceType;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(0, { message: 'La cantidad no puede ser menor a cero.' })
  quantity: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'La ubicación es obligatoria.' })
  location: string;
}
