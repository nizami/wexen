import {HttpRequest, HttpStatusCode} from '#wexen';
import {OutgoingHttpHeaders, ServerHttp2Stream} from 'node:http2';

export type HttpResponse = {
  headers: OutgoingHttpHeaders & {':status': HttpStatusCode};

  send: (stream: ServerHttp2Stream, request: HttpRequest) => Promise<void>;
};
