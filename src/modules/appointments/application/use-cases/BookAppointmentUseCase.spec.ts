import { BookAppointmentUseCase, BookAppointmentInput } from './BookAppointmentUseCase.js';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository.js';
import { IPatientRepository } from '../../../patients/domain/repositories/IPatientRepository.js';
import { Appointment, AppointmentStatus } from '../../domain/entities/Appointment.js';
import { Patient } from '../../../patients/domain/entities/Patient.js';
import { EntityNotFoundError } from '../../domain/exceptions/EntityNotFoundError.js';

describe('BookAppointmentUseCase', () => {
  let useCase: BookAppointmentUseCase;
  let mockAppointmentRepository: jest.Mocked<IAppointmentRepository>;
  let mockPatientRepository: jest.Mocked<IPatientRepository>;

  beforeEach(() => {
    mockAppointmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPatient: jest.fn(),
      findByDoctor: jest.fn(),
      bookAppointment: jest.fn(),
    };

    mockPatientRepository = {
      findById: jest.fn(),
      findByDocument: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new BookAppointmentUseCase(
      mockAppointmentRepository,
      mockPatientRepository,
    );
  });

  const patientEmail = 'patient@gmail.com';
  const availabilityId = 'slot-id-123';
  const samplePatient = Patient.create(
    'patient-uuid-1',
    'Carlos',
    'Ríos',
    'CC',
    '98765432',
    patientEmail,
    '3009876543',
    'Sura',
  );

  const sampleAppointment = Appointment.create(
    'appointment-uuid-1',
    'patient-uuid-1',
    'doctor-uuid-1',
    new Date(),
    '08:00',
    '08:30',
    AppointmentStatus.SCHEDULED,
  );

  it('should successfully book an appointment when patient exists', async () => {
    mockPatientRepository.findAll.mockResolvedValue([samplePatient]);
    mockAppointmentRepository.bookAppointment.mockResolvedValue(sampleAppointment);

    const input: BookAppointmentInput = { patientEmail, availabilityId };
    const result = await useCase.execute(input);

    expect(result).toBe(sampleAppointment);
    expect(mockPatientRepository.findAll).toHaveBeenCalled();
    expect(mockAppointmentRepository.bookAppointment).toHaveBeenCalledWith(
      'patient-uuid-1',
      availabilityId,
      expect.any(String),
    );
  });

  it('should throw EntityNotFoundError if patient with that email does not exist', async () => {
    mockPatientRepository.findAll.mockResolvedValue([]);

    const input: BookAppointmentInput = { patientEmail, availabilityId };
    await expect(useCase.execute(input)).rejects.toThrow(EntityNotFoundError);
    expect(mockAppointmentRepository.bookAppointment).not.toHaveBeenCalled();
  });
});
