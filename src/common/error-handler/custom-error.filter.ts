import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

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
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status;
    try {
      status = exception.getStatus();
    } catch (_) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    const customException: CustomException = {
      path: request.url,
      timestamp: new Date().toISOString(),
      status,
      message: {
        error: exception?.message ?? 'INTERNAL ERROR',
      },
    };

    response.status(customException.status).json(customException);
  }
}
