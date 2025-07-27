import {HttpHeaders, HttpStatusCode} from '#wexen';
import {Http2ServerRequest, Http2ServerResponse} from 'node:http2';

export type HttpResponse = {
  statusCode: HttpStatusCode;
  headers: HttpHeaders;
  body: string | Buffer;

  send(request: Http2ServerRequest, response: Http2ServerResponse): Promise<void>;
};
