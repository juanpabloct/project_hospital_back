export class DoctorAvailability {
  constructor(
    public readonly id: string,
    public readonly doctorId: string,
    public readonly date: Date,      // Specific date (e.g. 2026-05-20)
    public readonly startTime: string, // "09:00"
    public readonly endTime: string,   // "09:30"
    public readonly isBooked: boolean,
  ) {}

  static create(
    id: string,
    doctorId: string,
    date: Date,
    startTime: string,
    endTime: string,
    isBooked?: boolean,
  ): DoctorAvailability {
    return new DoctorAvailability(
      id,
      doctorId,
      date,
      startTime,
      endTime,
      isBooked || false,
    );
  }
}
