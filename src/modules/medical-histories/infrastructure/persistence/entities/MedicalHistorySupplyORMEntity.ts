import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MedicalHistoryRecordORMEntity } from './MedicalHistoryRecordORMEntity.js';
import { ResourceORMEntity } from '../../../../resources/infrastructure/persistence/entities/ResourceORMEntity.js';

@Entity('medical_history_supplies')
export class MedicalHistorySupplyORMEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  medicalHistoryRecordId: string;

  @ManyToOne(() => MedicalHistoryRecordORMEntity, (record) => record.supplies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicalHistoryRecordId' })
  medicalHistoryRecord: MedicalHistoryRecordORMEntity;

  @Column('uuid')
  resourceId: string;

  @ManyToOne(() => ResourceORMEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'resourceId' })
  resource: ResourceORMEntity;

  @Column({ type: 'int' })
  quantity: number;
}
