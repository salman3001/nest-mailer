import { HttpException, HttpStatus } from '@nestjs/common';

export class NestMailError extends HttpException {
  constructor(message: string, cause?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, { cause: cause });
  }
}
