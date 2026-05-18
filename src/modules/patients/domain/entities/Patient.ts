export class Patient {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly documentType: string,
    public readonly documentNumber: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly eps: string,
    public readonly registrationDate: Date,
  ) {}

  static create(
    id: string,
    firstName: string,
    lastName: string,
    documentType: string,
    documentNumber: string,
    email: string,
    phone: string,
    eps: string,
    registrationDate?: Date,
  ): Patient {
    return new Patient(
      id,
      firstName,
      lastName,
      documentType,
      documentNumber,
      email,
      phone,
      eps,
      registrationDate || new Date(),
    );
  }
}
