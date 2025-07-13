import {HttpResponse, HttpStatusCode, newHttpHeaders} from '#wexen';
import {IncomingMessage, ServerResponse} from 'node:http';

export type JsonResponse = HttpResponse & {};

export function newJsonResponse(
  value: unknown,
  statusCode: HttpStatusCode = HttpStatusCode.Ok,
): JsonResponse {
  return {
    statusCode,
    headers: newHttpHeaders({'content-type': 'application/json'}),
    body: JSON.stringify(value),

    async send(_request: IncomingMessage, response: ServerResponse): Promise<void> {
      response.writeHead(this.statusCode, this.headers.items);
      response.end(this.body);
    },
  };
}
