import {HttpResponse, HttpStatusCode, newHttpHeaders, None} from '#wexen';
import {Http2ServerRequest, Http2ServerResponse} from 'node:http2';

const notFoundMessage = JSON.stringify({error: 'Not Found'});

export type NotFoundResponse = HttpResponse & {};

export function newNotFoundResponse(value?: unknown | None): NotFoundResponse {
  return {
    statusCode: HttpStatusCode.NotFound,
    headers: newHttpHeaders({'content-type': 'application/json'}),
    body: value ? JSON.stringify(value) : notFoundMessage,

    async send(_request: Http2ServerRequest, response: Http2ServerResponse): Promise<void> {
      response.writeHead(this.statusCode, this.headers.items);
      response.end(this.body);
    },
  };
}
