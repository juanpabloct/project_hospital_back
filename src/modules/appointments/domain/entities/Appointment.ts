export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly appointmentDate: Date,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly status: AppointmentStatus,
    public readonly createdAt: Date,
  ) {}

  static create(
    id: string,
    patientId: string,
    doctorId: string,
    appointmentDate: Date,
    startTime: string,
    endTime: string,
    status?: AppointmentStatus,
    createdAt?: Date,
  ): Appointment {
    return new Appointment(
      id,
      patientId,
      doctorId,
      appointmentDate,
      startTime,
      endTime,
      status || AppointmentStatus.SCHEDULED,
      createdAt || new Date(),
    );
  }
}
