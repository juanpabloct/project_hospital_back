import { AppointmentORMEntity } from "src/modules/appointments/infrastructure/persistence/entities/AppointmentORMEntity";
import { DoctorORMEntity } from "src/modules/appointments/infrastructure/persistence/entities/DoctorORMEntity";
import { PatientORMEntity } from "src/modules/patients/infrastructure/persistence/entities/PatientORMEntity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { MedicalHistorySupplyORMEntity } from "./MedicalHistorySupplyORMEntity.js";


@Entity('medical_history_records')
export class MedicalHistoryRecordORMEntity {
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

  @Column('uuid', { nullable: true })
  appointmentId: string | null;

  @ManyToOne(() => AppointmentORMEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'appointmentId' })
  appointment: AppointmentORMEntity | null;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text' })
  treatment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => MedicalHistorySupplyORMEntity, (supply) => supply.medicalHistoryRecord, {
    cascade: true,
  })
  supplies: MedicalHistorySupplyORMEntity[];
}
