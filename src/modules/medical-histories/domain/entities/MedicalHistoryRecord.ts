export class MedicalHistorySupply {
  constructor(
    public readonly resourceId: string,
    public readonly name: string,
    public readonly quantity: number,
  ) {}
}

export class MedicalHistoryRecord {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly appointmentId: string | null,
    public readonly diagnosis: string,
    public readonly treatment: string,
    public readonly supplies: MedicalHistorySupply[],
    public readonly createdAt: Date,
  ) {}

  static create(
    id: string,
    patientId: string,
    doctorId: string,
    appointmentId: string | null,
    diagnosis: string,
    treatment: string,
    supplies: MedicalHistorySupply[],
    createdAt?: Date,
  ): MedicalHistoryRecord {
    return new MedicalHistoryRecord(
      id,
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      treatment,
      supplies,
      createdAt || new Date(),
    );
  }
}
