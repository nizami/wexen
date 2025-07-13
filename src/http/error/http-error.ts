import {HttpMethod, HttpStatusCode} from '#wexen';

export class HttpError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public method: HttpMethod,
    public url: string,
    message: string,
  ) {
    super(`${statusCode} ${method} ${url} ${message}`);
  }
}
