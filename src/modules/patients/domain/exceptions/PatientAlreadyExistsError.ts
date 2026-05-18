export class PatientAlreadyExistsError extends Error {
  constructor(documentType: string, documentNumber: string) {
    super(`El paciente con documento ${documentType} ${documentNumber} ya se encuentra registrado.`);
    this.name = 'PatientAlreadyExistsError';
  }
}
