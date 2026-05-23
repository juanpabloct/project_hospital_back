import { CreateMedicalHistoryUseCase, CreateMedicalHistoryInput } from './CreateMedicalHistoryUseCase.js';
import { IMedicalHistoryRepository } from '../../domain/repositories/IMedicalHistoryRepository.js';
import { IDoctorRepository } from '../../../appointments/domain/repositories/IDoctorRepository.js';
import { IPatientRepository } from '../../../patients/domain/repositories/IPatientRepository.js';
import { Patient } from '../../../patients/domain/entities/Patient.js';
import { Doctor } from '../../../appointments/domain/entities/Doctor.js';
import { MedicalHistoryRecord } from '../../domain/entities/MedicalHistoryRecord.js';
import { EntityNotFoundError } from '../../../appointments/domain/exceptions/EntityNotFoundError.js';
import { UserRole } from '../../../users/domain/entities/User.js';

describe('CreateMedicalHistoryUseCase', () => {
  let useCase: CreateMedicalHistoryUseCase;
  let mockMedicalHistoryRepository: jest.Mocked<IMedicalHistoryRepository>;
  let mockDoctorRepository: jest.Mocked<IDoctorRepository>;
  let mockPatientRepository: jest.Mocked<IPatientRepository>;

  beforeEach(() => {
    mockMedicalHistoryRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPatientId: jest.fn(),
      findByDoctorId: jest.fn(),
      findAll: jest.fn(),
    };

    mockDoctorRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      findBySpecialty: jest.fn(),
    };

    mockPatientRepository = {
      findById: jest.fn(),
      findByDocument: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new CreateMedicalHistoryUseCase(
      mockMedicalHistoryRepository,
      mockDoctorRepository,
      mockPatientRepository,
    );
  });

  const sampleInput: CreateMedicalHistoryInput = {
    patientId: 'patient-uuid-123',
    doctorUserId: 'doctor-user-uuid-456',
    requesterRole: UserRole.DOCTOR,
    diagnosis: 'Common Cold',
    treatment: 'Rest and fluids',
    supplies: [
      { resourceId: 'resource-uuid-1', quantity: 2 },
    ],
  };

  const samplePatient = Patient.create(
    'patient-uuid-123',
    'Diana',
    'Restrepo',
    'CC',
    '987654321',
    'diana@gmail.com',
    '3007777777',
    'Sura',
  );

  const sampleDoctor = Doctor.create(
    'doctor-uuid-789',
    'Alejandro',
    'Gómez',
    'specialty-uuid',
    'alejandro.doctor@hospital.com',
    '3158888888',
    'doctor-user-uuid-456',
  );

  it('should successfully create a medical history record', async () => {
    mockPatientRepository.findById.mockResolvedValue(samplePatient);
    mockDoctorRepository.findByUserId.mockResolvedValue(sampleDoctor);
    mockMedicalHistoryRepository.save.mockImplementation(async (record) => record);

    const result = await useCase.execute(sampleInput);

    expect(result.patientId).toBe('patient-uuid-123');
    expect(result.doctorId).toBe('doctor-uuid-789');
    expect(result.diagnosis).toBe('Common Cold');
    expect(result.treatment).toBe('Rest and fluids');
    expect(result.supplies[0].resourceId).toBe('resource-uuid-1');
    expect(result.supplies[0].quantity).toBe(2);
    expect(mockMedicalHistoryRepository.save).toHaveBeenCalled();
  });

  it('should throw EntityNotFoundError if patient does not exist', async () => {
    mockPatientRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(sampleInput)).rejects.toThrow(EntityNotFoundError);
    expect(mockMedicalHistoryRepository.save).not.toHaveBeenCalled();
  });

  it('should throw EntityNotFoundError if doctor does not exist', async () => {
    mockPatientRepository.findById.mockResolvedValue(samplePatient);
    mockDoctorRepository.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(sampleInput)).rejects.toThrow(EntityNotFoundError);
    expect(mockMedicalHistoryRepository.save).not.toHaveBeenCalled();
  });
});
