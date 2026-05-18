import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DomainExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || 'Error interno del servidor';
    const errorName = exception.name || (exception.constructor ? exception.constructor.name : 'UnknownError');

    // Map business domain errors to appropriate HTTP Status Codes
    if (
      errorName === 'UserAlreadyExistsError' ||
      errorName === 'PatientAlreadyExistsError' ||
      errorName === 'SlotNotAvailableError' ||
      errorName === 'DuplicateAppointmentError'
    ) {
      status = HttpStatus.CONFLICT;
    } else if (errorName === 'InvalidCredentialsError') {
      status = HttpStatus.UNAUTHORIZED;
    } else if (
      errorName === 'EntityNotFoundError' ||
      errorName === 'DoctorNotFoundError' ||
      errorName === 'PatientNotFoundError' ||
      errorName === 'SpecialtyNotFoundError'
    ) {
      status = HttpStatus.NOT_FOUND;
    } else if (
      errorName === 'InvalidSlotException' ||
      errorName === 'BusinessValidationError'
    ) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception.status && typeof exception.status === 'number') {
      // In case standard NestJS HttpException was thrown
      status = exception.status;
      const responseBody = exception.getResponse ? exception.getResponse() : null;
      if (responseBody && typeof responseBody === 'object') {
        return response.status(status).json(responseBody);
      }
      message = responseBody || exception.message;
    }

    // Beautiful dynamic error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorName,
      message: message,
    });
  }
}
