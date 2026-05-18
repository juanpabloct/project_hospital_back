export enum UserRole {
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    username: string,
    passwordHash: string,
    role: UserRole,
    createdAt?: Date,
    updatedAt?: Date,
  ): User {
    return new User(
      id,
      username,
      passwordHash,
      role,
      createdAt || new Date(),
      updatedAt || new Date(),
    );
  }
}
