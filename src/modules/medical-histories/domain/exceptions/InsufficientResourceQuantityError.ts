export class InsufficientResourceQuantityError extends Error {
  constructor(resourceName: string, available: number, requested: number) {
    super(`Cantidad insuficiente para el recurso "${resourceName}". Disponible: ${available}, Solicitado: ${requested}.`);
    this.name = 'InsufficientResourceQuantityError';
  }
}
