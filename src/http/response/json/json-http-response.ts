import {$WebType, HttpResponse, HttpStatusCode, newHttpHeaders} from '#mini-web';
import {IncomingMessage, ServerResponse} from 'node:http';
import {Brand} from 'rtt';

export type JsonHttpResponse = HttpResponse & Brand<'Web.JsonHttpResponse'> & {};

export const $JsonHttpResponse = () => $WebType<JsonHttpResponse>('JsonHttpResponse');

export function newJsonHttpResponse(
  value: unknown,
  statusCode: HttpStatusCode = HttpStatusCode.Ok,
): JsonHttpResponse {
  return {
    $type: $JsonHttpResponse(),
    statusCode,
    headers: newHttpHeaders({'content-type': 'application/json'}),
    body: JSON.stringify(value),

    async send(_request: IncomingMessage, response: ServerResponse): Promise<void> {
      response.writeHead(this.statusCode, this.headers.items);
      response.end(this.body);
    },
  };
}
