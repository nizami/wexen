import {HttpResponse, HttpStatusCode} from '#wexen';

export function newJsonResponse(value: unknown, statusCode = HttpStatusCode.Ok): HttpResponse {
  return {
    headers: {
      ':status': statusCode,
      'content-type': 'application/json',
    },

    async send(stream) {
      stream.respond(this.headers);
      stream.end(JSON.stringify(value));
    },
  };
}
