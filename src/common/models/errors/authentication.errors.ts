import { HttpException, HttpStatus } from '@nestjs/common';

export enum AuthenticationErrorCodes {
  WRONG_CREDENTIALS = 1,
  VALIDATE_ERROR = 2,
  NOT_PRIVILEGED = 3,
  UNKNOWN_ERROR = 4,
}

export const ERROR_AUTHENTICATING_ENTITY = (
  entityName: string,
  reason?: string,
) => ({
  errorCode: AuthenticationErrorCodes.WRONG_CREDENTIALS,
  message: `Error ${entityName.toLowerCase()}${!!reason ? ': ' + reason : ''}`,
});

export const ERROR_VALIDATING_ENTITY = (
  entityName: string,
  reason?: string,
) => ({
  errorCode: AuthenticationErrorCodes.VALIDATE_ERROR,
  message: `Error validating ${entityName.toLowerCase()}${
    !!reason ? ': ' + reason : ''
  }`,
});

export const ERROR_ENTITY_NOT_PRIVILEGED = (
  entityName: string,
  reason?: string,
) => ({
  errorCode: AuthenticationErrorCodes.NOT_PRIVILEGED,
  message: `Error ${entityName.toLowerCase()} not priviliged${
    !!reason ? ': ' + reason : ''
  }`,
});

export const UNKNOWN_AUTH_ERROR = {
  errorCode: AuthenticationErrorCodes.UNKNOWN_ERROR,
  message: `Unknown authentication error`,
};

export class UnauthorizedException extends HttpException {
  constructor(response = UNKNOWN_AUTH_ERROR) {
    super(response, HttpStatus.UNAUTHORIZED);
  }
}
