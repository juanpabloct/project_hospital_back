import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { User, UserRole } from '../../../domain/entities/User.js';
import { UserORMEntity } from '../entities/UserORMEntity.js';
import { UserMapper } from './UserMapper.js';

@Injectable()
export class UserRepositoryORM implements IUserRepository {
  constructor(
    @InjectRepository(UserORMEntity)
    private readonly ormRepository: Repository<UserORMEntity>,
  ) { }

  async findById(id: string): Promise<User | null> {
    const userOrm = await this.ormRepository.findOneBy({ id });
    return userOrm ? UserMapper.toDomain(userOrm) : null;
  }

  async findByRole(role: UserRole): Promise<User | null> {
    const userOrm = await this.ormRepository.findOneBy({ role });
    return userOrm ? UserMapper.toDomain(userOrm) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userOrm = await this.ormRepository.findOneBy({ username });
    return userOrm ? UserMapper.toDomain(userOrm) : null;
  }

  async save(user: User): Promise<User> {
    const userOrm = UserMapper.toORM(user);
    const savedOrm = await this.ormRepository.save(userOrm);
    return UserMapper.toDomain(savedOrm);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }

  async findAll(): Promise<User[]> {
    const usersOrm = await this.ormRepository.find();
    return usersOrm.map(UserMapper.toDomain);
  }
}
