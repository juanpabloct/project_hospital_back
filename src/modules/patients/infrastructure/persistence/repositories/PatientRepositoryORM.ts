import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPatientRepository } from '../../../domain/repositories/IPatientRepository.js';
import { Patient } from '../../../domain/entities/Patient.js';
import { PatientORMEntity } from '../entities/PatientORMEntity.js';
import { PatientMapper } from './PatientMapper.js';

@Injectable()
export class PatientRepositoryORM implements IPatientRepository {
  constructor(
    @InjectRepository(PatientORMEntity)
    private readonly ormRepository: Repository<PatientORMEntity>,
  ) {}

  async findById(id: string): Promise<Patient | null> {
    const ormPatient = await this.ormRepository.findOneBy({ id });
    return ormPatient ? PatientMapper.toDomain(ormPatient) : null;
  }

  async findByDocument(documentType: string, documentNumber: string): Promise<Patient | null> {
    const ormPatient = await this.ormRepository.findOneBy({ documentType, documentNumber });
    return ormPatient ? PatientMapper.toDomain(ormPatient) : null;
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const ormPatient = await this.ormRepository.findOneBy({ email });
    return ormPatient ? PatientMapper.toDomain(ormPatient) : null;
  }

  async save(patient: Patient): Promise<Patient> {
    const ormPatient = PatientMapper.toORM(patient);
    const savedOrm = await this.ormRepository.save(ormPatient);
    return PatientMapper.toDomain(savedOrm);
  }

  async findAll(): Promise<Patient[]> {
    const ormPatients = await this.ormRepository.find();
    return ormPatients.map(PatientMapper.toDomain);
  }
}
