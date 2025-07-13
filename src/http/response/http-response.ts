import {HttpHeaders, HttpStatusCode} from '#wexen';
import {IncomingMessage, ServerResponse} from 'node:http';

export type HttpResponse = {
  statusCode: HttpStatusCode;
  headers: HttpHeaders;
  body: string | Buffer;

  send(request: IncomingMessage, response: ServerResponse): Promise<void>;
};
