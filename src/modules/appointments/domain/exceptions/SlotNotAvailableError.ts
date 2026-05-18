export class SlotNotAvailableError extends Error {
  constructor(availabilityId: string) {
    super(`El horario solicitado (ID: ${availabilityId}) ya no se encuentra disponible.`);
    this.name = 'SlotNotAvailableError';
  }
}
