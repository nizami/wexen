import {$WebType, HttpResponse, HttpStatusCode, newHttpHeaders} from '#wexen';
import {IncomingMessage, ServerResponse} from 'node:http';
import {Brand} from 'rtt';

export type JsonResponse = HttpResponse & Brand<'Web.JsonResponse'> & {};

export const $JsonResponse = () => $WebType<JsonResponse>('JsonResponse');

export function newJsonResponse(
  value: unknown,
  statusCode: HttpStatusCode = HttpStatusCode.Ok,
): JsonResponse {
  return {
    $type: $JsonResponse(),
    statusCode,
    headers: newHttpHeaders({'content-type': 'application/json'}),
    body: JSON.stringify(value),

    async send(_request: IncomingMessage, response: ServerResponse): Promise<void> {
      response.writeHead(this.statusCode, this.headers.items);
      response.end(this.body);
    },
  };
}
