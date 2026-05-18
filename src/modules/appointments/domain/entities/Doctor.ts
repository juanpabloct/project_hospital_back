export class Doctor {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly specialtyId: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly userId: string,
  ) {}

  static create(
    id: string,
    firstName: string,
    lastName: string,
    specialtyId: string,
    email: string,
    phone: string,
    userId: string,
  ): Doctor {
    return new Doctor(id, firstName, lastName, specialtyId, email, phone, userId);
  }
}
