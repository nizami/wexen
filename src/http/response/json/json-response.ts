import {HttpResponse, HttpStatusCode, newHttpHeaders} from '#wexen';
import {Http2ServerRequest, Http2ServerResponse} from 'node:http2';

export type JsonResponse = HttpResponse & {};

export function newJsonResponse(
  value: unknown,
  statusCode: HttpStatusCode = HttpStatusCode.Ok,
): JsonResponse {
  return {
    statusCode,
    headers: newHttpHeaders({'content-type': 'application/json'}),
    body: JSON.stringify(value),

    async send(_request: Http2ServerRequest, response: Http2ServerResponse): Promise<void> {
      response.writeHead(this.statusCode, this.headers.items);
      response.end(this.body);
    },
  };
}
