export class Specialty {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
  ) {}

  static create(id: string, name: string, description: string): Specialty {
    return new Specialty(id, name, description);
  }
}
