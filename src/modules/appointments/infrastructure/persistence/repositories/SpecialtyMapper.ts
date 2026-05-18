import { Specialty } from '../../../domain/entities/Specialty.js';
import { SpecialtyORMEntity } from '../entities/SpecialtyORMEntity.js';

export class SpecialtyMapper {
  static toDomain(orm: SpecialtyORMEntity): Specialty {
    return new Specialty(orm.id, orm.name, orm.description);
  }

  static toORM(domain: Specialty): SpecialtyORMEntity {
    const orm = new SpecialtyORMEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.description = domain.description;
    return orm;
  }
}
