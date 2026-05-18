import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ResourceType } from '../../../domain/entities/Resource.js';

@Entity('resources')
export class ResourceORMEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ResourceType,
  })
  type: ResourceType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  location: string;
}
