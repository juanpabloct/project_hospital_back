import { User, UserRole } from '../entities/User.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByRole(role: UserRole): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
}
