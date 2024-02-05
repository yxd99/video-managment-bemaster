import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ClassValidatorError } from '@shared/types';

interface CustomException {
  path: string;
  timestamp: string;
  status: number;
  message: {
    error: string;
    details?: string | string[];
  };
}

@Catch()
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: ClassValidatorError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const details =
      typeof exception?.response.message === 'string'
        ? exception.response.message
        : [...exception.response.message];

    const customException: CustomException = {
      path: request.url,
      timestamp: new Date().toISOString(),
      status:
        exception?.response.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      message: {
        error: exception.response.error,
        details,
      },
    };

    response.status(customException.status).json(customException);
  }
}
