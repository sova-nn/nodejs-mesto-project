import { Request, NextFunction, Response } from 'express';
import {ERROR_MESSAGES, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND, STATUS_CODES} from "./errors/config";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const databaseErrors = {
    ValidationError: {
      status: HTTP_STATUS_BAD_REQUEST,
      message: ERROR_MESSAGES.ValidationError,
    },
    CastError: {
      status: HTTP_STATUS_BAD_REQUEST,
      message: ERROR_MESSAGES.CastError,
    },
    DocumentNotFoundError: {
      status: HTTP_STATUS_NOT_FOUND,
      message: ERROR_MESSAGES.DocumentNotFoundError,
    },
  };
  let { statusCode = STATUS_CODES.Error500, message } = err;
  type tDatabaseErrorKey = keyof typeof databaseErrors;

  // eslint-disable-next-line max-len
  const databaseErrorsKeys: tDatabaseErrorKey[] = Object.keys(databaseErrors) as tDatabaseErrorKey[];
  databaseErrorsKeys.forEach((errorKey: tDatabaseErrorKey) => {
    if (err.stack.includes(errorKey)) {
      statusCode = databaseErrors[errorKey].status;
      message = databaseErrors[errorKey].message;
    }
  });
  res
    .status(statusCode)
    .send({
      // eslint-disable-next-line no-nested-ternary
      message: statusCode === STATUS_CODES.Error500
        ? ERROR_MESSAGES.ServerError
        : message,
    });
};
