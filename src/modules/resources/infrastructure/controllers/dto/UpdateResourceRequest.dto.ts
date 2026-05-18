import { IsString, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { ResourceType } from '../../../domain/entities/Resource.js';

export class UpdateResourceRequestDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ResourceType, {
    message: 'El tipo debe ser MEDICINE, CLOTHING o EQUIPMENT.',
  })
  @IsOptional()
  type?: ResourceType;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(0, { message: 'La cantidad no puede ser menor a cero.' })
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
