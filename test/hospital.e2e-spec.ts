import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { DomainExceptionsFilter } from './../src/common/filters/domain-exceptions.filter.js';

describe('Hospital System E2E Validation', () => {
  let app: INestApplication;
  
  // Shared E2E tokens and IDs
  let adminToken: string;
  let receptionistToken: string;
  let patientToken: string;
  
  let patientUsername: string;
  let patientDocNum: string;
  
  let specialtyId: string;
  let doctorId: string;
  let availabilityId: string;
  let resourceId: string;
  
  const testSuffix = Date.now();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Exact configurations as src/main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new DomainExceptionsFilter());
    
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // =========================================================================
  // HU-03: GESTIÓN DE USUARIOS Y ROLES (ADMINISTRADOR)
  // =========================================================================
  describe('HU-03: Administración de Usuarios y Restricción de Roles', () => {
    
    it('1. Debe iniciar sesión exitosamente como el Administrador Inicial sembrado', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'admin@hospital.com',
          password: 'adminpassword',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.role).toBe('ADMIN');
      adminToken = response.body.accessToken;
    });

    it('2. El Administrador debe poder crear una cuenta para un Recepcionista', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: `recepcionista_${testSuffix}@hospital.com`,
          password: 'recepcionista_pass_123',
          role: 'RECEPTIONIST',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(`recepcionista_${testSuffix}@hospital.com`);
      expect(response.body.role).toBe('RECEPTIONIST');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('3. El Administrador debe poder crear una cuenta para un Médico', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: `medico_${testSuffix}@hospital.com`,
          password: 'medico_pass_123',
          role: 'DOCTOR',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.role).toBe('DOCTOR');
    });

    it('4. Debe rechazar la creación de usuarios si no se provee autenticación (401)', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: `user_unauth_${testSuffix}@hospital.com`,
          password: 'password_123',
          role: 'PATIENT',
        })
        .expect(401);
    });

    it('5. Debe rechazar la creación de usuarios si la realiza un rol no autorizado (403)', async () => {
      // Primero iniciamos sesión con el recepcionista recién creado para obtener su token
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: `recepcionista_${testSuffix}@hospital.com`,
          password: 'recepcionista_pass_123',
        })
        .expect(200);

      receptionistToken = loginRes.body.accessToken;

      // Intentamos crear un nuevo usuario usando el token del recepcionista (debería denegarse)
      await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send({
          username: `intruso_${testSuffix}@hospital.com`,
          password: 'password_123',
          role: 'ADMIN',
        })
        .expect(403);
    });
  });

  // =========================================================================
  // HU-01: REGISTRO DE PACIENTES (RECEPCIONISTA)
  // =========================================================================
  describe('HU-01: Registro de Pacientes y Prevención de Duplicados', () => {
    patientUsername = `paciente_${testSuffix}@gmail.com`;
    patientDocNum = `DOC_${testSuffix}`;

    it('1. El Recepcionista debe registrar exitosamente a un nuevo paciente con EPS', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/patients')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send({
          firstName: 'Juan',
          lastName: 'Pérez E2E',
          documentType: 'CC',
          documentNumber: patientDocNum,
          email: patientUsername,
          phone: '5551234',
          eps: 'Sanitas',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe('Juan');
      expect(response.body.documentNumber).toBe(patientDocNum);
      expect(response.body.eps).toBe('Sanitas');
      expect(response.body).toHaveProperty('registrationDate');
      
      // Validar que la fecha y hora de registro estén guardadas
      expect(new Date(response.body.registrationDate).getTime()).not.toBeNaN();
    });

    it('2. Debe impedir registrar un paciente con el mismo tipo y número de documento (Duplicado)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/patients')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send({
          firstName: 'Juan Duplicado',
          lastName: 'Pérez Duplicado',
          documentType: 'CC',
          documentNumber: patientDocNum, // Mismo documento
          email: `paciente_duplicado_${testSuffix}@gmail.com`,
          phone: '9999999',
          eps: 'Sura',
        })
        .expect(409); // Devuelve error de dominio de paciente ya existente (mapped to 409 Conflict)

      expect(response.body.message).toContain(patientDocNum);
    });

    it('3. El Recepcionista debe poder listar todos los pacientes registrados', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/patients')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find((p: any) => p.documentNumber === patientDocNum);
      expect(found).toBeDefined();
    });

    it('4. Debe denegar el acceso a registrar pacientes a roles no autorizados (p. ej., Paciente)', async () => {
      // 1. Iniciamos sesión con la cuenta de usuario del paciente que se creó automáticamente
      // en el paso 1 (con su email como username y su documentNumber como contraseña)
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: patientUsername,
          password: patientDocNum,
        })
        .expect(200);

      patientToken = loginRes.body.accessToken;

      // 2. Intentamos registrar a otro paciente usando este token de Paciente
      await request(app.getHttpServer())
        .post('/api/patients')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          firstName: 'Paciente Intruso',
          lastName: 'Intruso',
          documentType: 'CC',
          documentNumber: `INT_${testSuffix}`,
          email: `intruso_paciente_${testSuffix}@gmail.com`,
          phone: '1111111',
          eps: 'Compensar',
        })
        .expect(403);
    });
  });

  // =========================================================================
  // HU-02: AGENDAMIENTO DE CITAS AUTÓNOMO (PACIENTE)
  // =========================================================================
  describe('HU-02: Agendamiento de Citas y Validación de Disponibilidad Real', () => {
    
    // Primero, el Administrador prepara la especialidad, el médico y la disponibilidad
    it('1. El Administrador debe poder crear una especialidad médica', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/appointments/specialties')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Cardiología E2E_${testSuffix}`,
          description: 'Especialidad encargada de enfermedades del corazón.',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(`Cardiología E2E_${testSuffix}`);
      specialtyId = response.body.id;
    });

    it('2. El Administrador debe poder crear un médico asociado a la especialidad', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/appointments/doctors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Dr. Gregory',
          lastName: `House_${testSuffix}`,
          specialtyId: specialtyId,
          email: `drhouse_${testSuffix}@hospital.com`,
          phone: '999888777',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe('Dr. Gregory');
      doctorId = response.body.id;
    });

    it('3. El Administrador (o Médico) debe poder configurar una disponibilidad para el médico', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/appointments/availabilities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          doctorId: doctorId,
          date: '2026-06-18',
          startTime: '09:00',
          endTime: '09:30',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.isBooked).toBe(false);
      availabilityId = response.body.id;
    });

    // Ahora, el paciente realiza el flujo de agendamiento autónomamente
    it('4. El Paciente de manera autónoma debe poder consultar las especialidades', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/appointments/specialties')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find((s: any) => s.id === specialtyId);
      expect(found).toBeDefined();
    });

    it('5. El Paciente debe poder consultar los médicos de la especialidad seleccionada', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/appointments/doctors?specialtyId=${specialtyId}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find((d: any) => d.id === doctorId);
      expect(found).toBeDefined();
    });

    it('6. El Paciente debe poder ver los horarios (disponibilidades) del médico', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/appointments/availabilities?doctorId=${doctorId}`) // Omit date filter to bypass timezone offset issues
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find((a: any) => a.id === availabilityId);
      expect(found).toBeDefined();
      expect(found.isBooked).toBe(false);
    });

    it('7. El Paciente debe poder agendar autónomamente la cita médica', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/appointments/book')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          availabilityId: availabilityId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('SCHEDULED');
      expect(response.body.patientId).toBeDefined();
    });

    it('8. Validación de Disponibilidad Real: Intentar agendar la misma cita nuevamente debe fallar', async () => {
      // Volvemos a mandar el mismo body de reserva para el slot ocupado
      const response = await request(app.getHttpServer())
        .post('/api/appointments/book')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          availabilityId: availabilityId,
        })
        .expect(409); // Falla debido a validación de disponibilidad real (ya agendada, mapped to 409 Conflict)

      expect(response.body.message).toContain('ya no se encuentra disponible');
    });
  });

  // =========================================================================
  // HU-04: ADMINISTRACIÓN DE RECURSOS (ADMINISTRADOR)
  // =========================================================================
  describe('HU-04: Gestión de Recursos Hospitalarios y Autorización', () => {

    it('1. El Administrador debe poder crear un nuevo recurso hospitalario', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/resources')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Mascarillas N95 E2E_${testSuffix}`,
          type: 'CLOTHING',
          quantity: 200,
          description: 'Elementos de bioprotección respiratoria.',
          location: 'Bodega Central de Insumos',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(`Mascarillas N95 E2E_${testSuffix}`);
      expect(response.body.quantity).toBe(200);
      resourceId = response.body.id;
    });

    it('2. El Administrador debe poder ver y listar los recursos', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/resources')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find((r: any) => r.id === resourceId);
      expect(found).toBeDefined();
    });

    it('3. El Administrador debe poder actualizar un recurso (p. ej., cantidad)', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/resources/${resourceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 350,
          location: 'Bodega Auxiliar de Insumos',
        })
        .expect(200);

      expect(response.body.quantity).toBe(350);
      expect(response.body.location).toBe('Bodega Auxiliar de Insumos');
    });

    it('4. Debe denegar la gestión de recursos a usuarios no administradores (p. ej., Recepcionista)', async () => {
      // Recepcionista intenta actualizar cantidad de recursos
      await request(app.getHttpServer())
        .put(`/api/resources/${resourceId}`)
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send({
          quantity: 1000,
        })
        .expect(403);

      // Recepcionista intenta borrar recursos
      await request(app.getHttpServer())
        .delete(`/api/resources/${resourceId}`)
        .set('Authorization', `Bearer ${receptionistToken}`)
        .expect(403);
    });

    it('5. El Administrador debe poder eliminar un recurso hospitalario', async () => {
      await request(app.getHttpServer())
        .delete(`/api/resources/${resourceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204); // Retorna No Content

      // Confirmar que ya no existe consultando el recurso individual
      await request(app.getHttpServer())
        .get(`/api/resources/${resourceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
