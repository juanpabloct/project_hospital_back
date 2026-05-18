import { Resource } from '../../../domain/entities/Resource.js';
import { ResourceORMEntity } from '../entities/ResourceORMEntity.js';

export class ResourceMapper {
  static toDomain(orm: ResourceORMEntity): Resource {
    return new Resource(
      orm.id,
      orm.name,
      orm.type,
      orm.quantity,
      orm.description,
      orm.location,
    );
  }

  static toORM(domain: Resource): ResourceORMEntity {
    const orm = new ResourceORMEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.type = domain.type;
    orm.quantity = domain.quantity;
    orm.description = domain.description;
    orm.location = domain.location;
    return orm;
  }
}
