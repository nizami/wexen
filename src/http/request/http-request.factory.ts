import {$HttpRequest, HttpMethod, HttpRequest, newHttpHeaders} from '#mini-web';
import {IncomingMessage} from 'node:http';
import {parse} from 'node:url';

export function newHttpRequest(request: IncomingMessage): HttpRequest {
  return {
    $type: $HttpRequest(),
    remoteAddress: request.socket.remoteAddress ?? '<unknown>',
    // todo checked before used
    method: request.method as HttpMethod,
    originalUrl: request.url ?? '',
    url: parse(request.url ?? '', true),
    headers: newHttpHeaders((request.headers as Record<string, string>) ?? {}),
  };
}
