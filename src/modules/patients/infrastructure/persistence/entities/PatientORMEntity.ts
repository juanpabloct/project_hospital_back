import { Entity, PrimaryColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('patients')
@Unique(['documentType', 'documentNumber'])
export class PatientORMEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  documentType: string;

  @Column()
  documentNumber: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  eps: string;

  @CreateDateColumn({ type: 'timestamp' })
  registrationDate: Date;
}
