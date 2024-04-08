import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        message: 'Your email already exists',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
