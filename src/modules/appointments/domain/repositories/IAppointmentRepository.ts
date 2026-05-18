import { Appointment } from '../entities/Appointment.js';

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findByPatient(patientId: string): Promise<Appointment[]>;
  findByDoctor(doctorId: string, date?: Date): Promise<Appointment[]>;
  
  /**
   * Books an appointment atomically.
   * Locks the availability slot for update to prevent double-booking.
   */
  bookAppointment(
    patientId: string,
    availabilityId: string,
    appointmentId: string,
  ): Promise<Appointment>;
}
