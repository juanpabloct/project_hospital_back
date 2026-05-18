import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { DoctorORMEntity } from './DoctorORMEntity.js';
import { PatientORMEntity } from '../../../../patients/infrastructure/persistence/entities/PatientORMEntity.js';
import { AppointmentStatus } from '../../../domain/entities/Appointment.js';

@Entity('appointments')
export class AppointmentORMEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @ManyToOne(() => PatientORMEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patientId' })
  patient: PatientORMEntity;

  @Column('uuid')
  doctorId: string;

  @ManyToOne(() => DoctorORMEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'doctorId' })
  doctor: DoctorORMEntity;

  @Column({ type: 'date' })
  appointmentDate: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
