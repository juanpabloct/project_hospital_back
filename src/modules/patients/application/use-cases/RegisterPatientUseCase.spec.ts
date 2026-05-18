import { RegisterPatientUseCase, RegisterPatientInput } from './RegisterPatientUseCase.js';
import { IPatientRepository } from '../../domain/repositories/IPatientRepository.js';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository.js';
import { IPasswordHasher } from '../../../users/application/interfaces/IPasswordHasher.js';
import { Patient } from '../../domain/entities/Patient.js';
import { User, UserRole } from '../../../users/domain/entities/User.js';
import { PatientAlreadyExistsError } from '../../domain/exceptions/PatientAlreadyExistsError.js';
import { UserAlreadyExistsError } from '../../../users/domain/exceptions/UserAlreadyExistsError.js';

describe('RegisterPatientUseCase', () => {
  let useCase: RegisterPatientUseCase;
  let mockPatientRepository: jest.Mocked<IPatientRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockPasswordHasher: jest.Mocked<IPasswordHasher>;

  beforeEach(() => {
    mockPatientRepository = {
      findById: jest.fn(),
      findByDocument: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    mockPasswordHasher = {
      hash: jest.fn().mockResolvedValue('hashed_password'),
      compare: jest.fn(),
    };

    useCase = new RegisterPatientUseCase(
      mockPatientRepository,
      mockUserRepository,
      mockPasswordHasher,
    );
  });

  const sampleInput: RegisterPatientInput = {
    firstName: 'Juan',
    lastName: 'Pérez',
    documentType: 'CC',
    documentNumber: '12345678',
    email: 'juan@perez.com',
    phone: '3001234567',
    eps: 'Sura',
  };

  it('should successfully register a patient and create a patient user account', async () => {
    mockPatientRepository.findByDocument.mockResolvedValue(null);
    mockUserRepository.findByUsername.mockResolvedValue(null);
    mockPatientRepository.save.mockImplementation(async (patient) => patient);
    mockUserRepository.save.mockImplementation(async (user) => user);

    const result = await useCase.execute(sampleInput);

    expect(result.firstName).toBe('Juan');
    expect(result.documentNumber).toBe('12345678');
    expect(mockPatientRepository.save).toHaveBeenCalled();
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('12345678');
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'juan@perez.com',
        role: UserRole.PATIENT,
      }),
    );
  });

  it('should throw PatientAlreadyExistsError if patient with document already exists', async () => {
    mockPatientRepository.findByDocument.mockResolvedValue(
      Patient.create('existing_id', 'Ana', 'Gómez', 'CC', '12345678', 'ana@gmail.com', '123', 'Sura'),
    );

    await expect(useCase.execute(sampleInput)).rejects.toThrow(PatientAlreadyExistsError);
    expect(mockPatientRepository.save).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw UserAlreadyExistsError if username email is already taken', async () => {
    mockPatientRepository.findByDocument.mockResolvedValue(null);
    mockUserRepository.findByUsername.mockResolvedValue(
      User.create('existing_uid', 'juan@perez.com', 'hash', UserRole.PATIENT),
    );

    await expect(useCase.execute(sampleInput)).rejects.toThrow(UserAlreadyExistsError);
    expect(mockPatientRepository.save).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
