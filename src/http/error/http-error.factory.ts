import {$HttpError, HttpError, HttpStatusCode} from '#wexen';

export function newHttpError(message: string, statusCode: HttpStatusCode): HttpError {
  return {
    $type: $HttpError(),
    message,
    statusCode,
  };
}
