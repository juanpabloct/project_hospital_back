import { IsString, IsNotEmpty } from 'class-validator';

export class BookAppointmentRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El ID de disponibilidad es obligatorio.' })
  availabilityId: string;
}
