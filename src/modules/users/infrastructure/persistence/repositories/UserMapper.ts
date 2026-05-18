import { User } from '../../../domain/entities/User.js';
import { UserORMEntity } from '../entities/UserORMEntity.js';

export class UserMapper {
  static toDomain(ormEntity: UserORMEntity): User {
    return new User(
      ormEntity.id,
      ormEntity.username,
      ormEntity.passwordHash,
      ormEntity.role,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toORM(domainEntity: User): UserORMEntity {
    const ormEntity = new UserORMEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.username = domainEntity.username;
    ormEntity.passwordHash = domainEntity.passwordHash;
    ormEntity.role = domainEntity.role;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}
