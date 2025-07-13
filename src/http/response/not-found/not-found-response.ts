import {HttpResponse, HttpStatusCode, newHttpHeaders, None} from '#wexen';
import {IncomingMessage, ServerResponse} from 'node:http';

const notFoundMessage = JSON.stringify({error: 'Not Found'});

export type NotFoundResponse = HttpResponse & {};

export function newNotFoundResponse(value?: unknown | None): NotFoundResponse {
  return {
    statusCode: HttpStatusCode.NotFound,
    headers: newHttpHeaders({'content-type': 'application/json'}),
    body: value ? JSON.stringify(value) : notFoundMessage,

    async send(_request: IncomingMessage, response: ServerResponse): Promise<void> {
      response.writeHead(this.statusCode, this.headers.items);
      response.end(this.body);
    },
  };
}
