import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SpecialtyORMEntity } from './SpecialtyORMEntity.js';

@Entity('doctors')
export class DoctorORMEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('uuid')
  specialtyId: string;

  @ManyToOne(() => SpecialtyORMEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'specialtyId' })
  specialty: SpecialtyORMEntity;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('uuid')
  userId: string;
}
