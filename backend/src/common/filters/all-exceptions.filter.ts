import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'SERVER_ERROR';
    let message = 'Internal server error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      message = res.message || exception.message;
      
      switch (status) {
        case HttpStatus.BAD_REQUEST: code = 'INVALID_REQUEST'; break;
        case HttpStatus.UNAUTHORIZED: code = 'UNAUTHORIZED'; break;
        case HttpStatus.FORBIDDEN: code = 'FORBIDDEN'; break;
        case HttpStatus.NOT_FOUND: code = 'NOT_FOUND'; break;
        case HttpStatus.UNPROCESSABLE_ENTITY: code = 'INSUFFICIENT_DATA'; break;
        case HttpStatus.TOO_MANY_REQUESTS: code = 'RATE_LIMIT'; break;
      }
    }

    response.status(status).json({
      error: {
        code,
        message,
        details,
      }
    });
  }
}
