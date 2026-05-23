import { GetPatientMedicalHistoryUseCase, GetPatientMedicalHistoryInput } from './GetPatientMedicalHistoryUseCase.js';
import { IMedicalHistoryRepository } from '../../domain/repositories/IMedicalHistoryRepository.js';
import { IPatientRepository } from '../../../patients/domain/repositories/IPatientRepository.js';
import { Patient } from '../../../patients/domain/entities/Patient.js';
import { MedicalHistoryRecord } from '../../domain/entities/MedicalHistoryRecord.js';
import { EntityNotFoundError } from '../../../appointments/domain/exceptions/EntityNotFoundError.js';
import { UserRole } from '../../../users/domain/entities/User.js';
import { ForbiddenException } from '@nestjs/common';

describe('GetPatientMedicalHistoryUseCase', () => {
  let useCase: GetPatientMedicalHistoryUseCase;
  let mockMedicalHistoryRepository: jest.Mocked<IMedicalHistoryRepository>;
  let mockPatientRepository: jest.Mocked<IPatientRepository>;

  beforeEach(() => {
    mockMedicalHistoryRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPatientId: jest.fn(),
      findByDoctorId: jest.fn(),
      findAll: jest.fn(),
    };

    mockPatientRepository = {
      findById: jest.fn(),
      findByDocument: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new GetPatientMedicalHistoryUseCase(
      mockMedicalHistoryRepository,
      mockPatientRepository,
    );
  });

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

  const sampleRecord = MedicalHistoryRecord.create(
    'record-uuid-1',
    'patient-uuid-123',
    'doctor-uuid-789',
    null,
    'Fiebre',
    'Acetaminofen',
    [],
  );

  it('should successfully return patient records for a DOCTOR', async () => {
    mockPatientRepository.findById.mockResolvedValue(samplePatient);
    mockMedicalHistoryRepository.findByPatientId.mockResolvedValue([sampleRecord]);

    const result = await useCase.execute({
      patientId: 'patient-uuid-123',
      requesterEmail: 'doctor@hospital.com',
      requesterRole: UserRole.DOCTOR,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('record-uuid-1');
    expect(mockMedicalHistoryRepository.findByPatientId).toHaveBeenCalledWith('patient-uuid-123');
  });

  it('should successfully return patient records for the PATIENT themselves', async () => {
    mockPatientRepository.findById.mockResolvedValue(samplePatient);
    mockPatientRepository.findByEmail.mockResolvedValue(samplePatient);
    mockMedicalHistoryRepository.findByPatientId.mockResolvedValue([sampleRecord]);

    const result = await useCase.execute({
      patientId: 'patient-uuid-123',
      requesterEmail: 'diana@gmail.com',
      requesterRole: UserRole.PATIENT,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('record-uuid-1');
  });

  it('should throw ForbiddenException if PATIENT requests another patients medical history', async () => {
    mockPatientRepository.findById.mockResolvedValue(samplePatient);
    mockPatientRepository.findByEmail.mockResolvedValue(
      Patient.create('other-patient-uuid', 'Carlos', 'Gomez', 'CC', '102030', 'carlos@gmail.com', '12', 'Sura')
    );

    await expect(
      useCase.execute({
        patientId: 'patient-uuid-123',
        requesterEmail: 'carlos@gmail.com',
        requesterRole: UserRole.PATIENT,
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(mockMedicalHistoryRepository.findByPatientId).not.toHaveBeenCalled();
  });

  it('should throw EntityNotFoundError if patient does not exist', async () => {
    mockPatientRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        patientId: 'non-existing-patient',
        requesterEmail: 'doctor@hospital.com',
        requesterRole: UserRole.DOCTOR,
      }),
    ).rejects.toThrow(EntityNotFoundError);

    expect(mockMedicalHistoryRepository.findByPatientId).not.toHaveBeenCalled();
  });
});
