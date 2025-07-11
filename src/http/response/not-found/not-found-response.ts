import {$WebType, HttpResponse, HttpStatusCode, newHttpHeaders, None} from '#wexen';
import {IncomingMessage, ServerResponse} from 'node:http';
import {Brand} from 'rtt';

const notFoundMessage = JSON.stringify({message: 'Not Found'});

export type NotFoundResponse = HttpResponse & Brand<'Web.NotFoundResponse'> & {};

export const $NotFoundResponse = () => $WebType<NotFoundResponse>('NotFoundResponse');

export function newNotFoundResponse(value?: unknown | None): NotFoundResponse {
  return {
    $type: $NotFoundResponse(),
    statusCode: HttpStatusCode.NotFound,
    headers: newHttpHeaders({'content-type': 'application/json'}),
    body: value ? JSON.stringify(value) : notFoundMessage,

    async send(_request: IncomingMessage, response: ServerResponse): Promise<void> {
      response.writeHead(this.statusCode, this.headers.items);
      response.end(this.body);
    },
  };
}
