import {$HttpError, HttpError, HttpStatusCode} from '#mini-web';

export function newHttpError(message: string, statusCode: HttpStatusCode): HttpError {
  return {
    $type: $HttpError(),
    message,
    statusCode,
  };
}
