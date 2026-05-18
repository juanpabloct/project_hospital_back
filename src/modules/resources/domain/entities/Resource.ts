export enum ResourceType {
  MEDICINE = 'MEDICINE',
  CLOTHING = 'CLOTHING',
  EQUIPMENT = 'EQUIPMENT',
}

export class Resource {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: ResourceType,
    public readonly quantity: number,
    public readonly description: string,
    public readonly location: string,
  ) {}

  static create(
    id: string,
    name: string,
    type: ResourceType,
    quantity: number,
    description: string,
    location: string,
  ): Resource {
    return new Resource(id, name, type, quantity, description, location);
  }
}
