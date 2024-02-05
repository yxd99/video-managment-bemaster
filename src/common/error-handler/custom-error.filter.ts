import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ClassValidatorError, Error } from '@shared/types';

@Catch()
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: ClassValidatorError | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const customException = {
      path: request.url,
      timestamp: new Date().toISOString(),
      status: null,
      message: null,
    };

    if ('message' in exception) {
      const { response: exceptionClassValidator } =
        exception as ClassValidatorError;
      customException.message = {
        error: exceptionClassValidator?.error ?? exception.message,
        details: exceptionClassValidator?.message,
      };
      customException.status =
        exceptionClassValidator?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      const exceptionError = exception as Error;
      customException.message = exceptionError.error;
      customException.status = exceptionError.statusCode;
    }
    response.status(customException.status).json(customException);
  }
}
