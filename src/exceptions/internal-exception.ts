import { ErrorCode, HttpException } from "./root";

export class InternalException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors: any) {
    super(message, errorCode, 500, errors);
  }
}

export class BadRequestsException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 400, errors);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 404, errors);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 401, errors);
  }
}
