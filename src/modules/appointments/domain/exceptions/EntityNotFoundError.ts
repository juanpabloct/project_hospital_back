export class EntityNotFoundError extends Error {
  constructor(entityName: string, id: string) {
    super(`El elemento '${entityName}' con ID '${id}' no existe.`);
    this.name = 'EntityNotFoundError';
  }
}
