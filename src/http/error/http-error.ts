import {HttpStatusCode} from '#wexen';

export class HttpError extends Error {
  constructor(public statusCode: HttpStatusCode, message: string) {
    super(message);
  }
}
