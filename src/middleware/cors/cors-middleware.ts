import {HttpMethod, HttpResponse, HttpStatusCode, Middleware} from '#wexen';

export function corsMiddleware(origins: string[]): Middleware {
  return async (request) => {
    if (request.method !== HttpMethod.Options) {
      return null;
    }

    const origin = request.headers['origin'];

    if (!origin || !origins.includes(origin)) {
      return null;
    }

    const response: HttpResponse = {
      headers: {
        ':status': HttpStatusCode.NoContent,
        'content-type': 'application/json',
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE',
        'access-control-allow-headers': 'Content-Type, Authorization, X-Filename',
        'access-control-allow-credentials': 'true',
      },

      async send(stream) {
        stream.respond(this.headers);
        stream.end();
      },
    };

    return response;
  };
}
