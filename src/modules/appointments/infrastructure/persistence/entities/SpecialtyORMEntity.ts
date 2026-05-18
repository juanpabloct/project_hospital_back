import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('specialties')
export class SpecialtyORMEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
