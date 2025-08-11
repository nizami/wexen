import {HttpResponse, HttpStatusCode, None} from '#wexen';

const notFoundMessage = JSON.stringify({error: 'Not Found'});

export function newNotFoundResponse(value?: unknown | None): HttpResponse {
  return {
    headers: {
      ':status': HttpStatusCode.NotFound,
      'content-type': 'application/json',
    },

    async send(stream) {
      stream.respond(this.headers);
      stream.end(value ? JSON.stringify(value) : notFoundMessage);
    },
  };
}
