import {HttpMethod, HttpRequest, newHttpHeaders, None} from '#wexen';
import {IncomingMessage} from 'node:http';
import {parse} from 'node:url';

export function newHttpRequest(request: IncomingMessage): HttpRequest {
  let _data: string | None = null;

  return {
    remoteAddress: request.socket.remoteAddress,
    // todo checked before used
    method: request.method as HttpMethod,
    url: parse(request.url ?? '', true),
    headers: newHttpHeaders(request.headers),

    async text(): Promise<string> {
      if (_data) {
        return _data;
      }

      return new Promise((resolve, reject) => {
        let data = '';

        request.on('data', (chunk) => (data += chunk));
        request.on('end', () => {
          _data = data;
          resolve(data);
        });

        request.on('error', (err) => reject(err));
      });
    },

    async json(): Promise<unknown> {
      return JSON.parse(await this.text());
    },
  };
}
