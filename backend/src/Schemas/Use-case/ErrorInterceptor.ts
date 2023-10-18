import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Catch()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.error(err);
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'you make a bad request',
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }
}
