export class ResourceNotFoundError extends Error {
  constructor(id: string) {
    super(`El recurso hospitalario con ID '${id}' no existe.`);
    this.name = 'EntityNotFoundError'; // Using same name 'EntityNotFoundError' to match global filter!
  }
}
