import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { DoctorORMEntity } from './DoctorORMEntity.js';

@Entity('doctor_availabilities')
@Index(['doctorId', 'date', 'startTime'], { unique: true })
export class DoctorAvailabilityORMEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  doctorId: string;

  @ManyToOne(() => DoctorORMEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: DoctorORMEntity;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: false })
  isBooked: boolean;
}
