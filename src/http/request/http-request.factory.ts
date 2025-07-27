import {HttpMethod, HttpRequest, newHttpHeaders, None} from '#wexen';
import {Http2ServerRequest} from 'node:http2';
import {parse} from 'node:url';

export function newHttpRequest(request: Http2ServerRequest): HttpRequest {
  let _data: string | None = null;

  return {
    remoteAddress: request.socket.remoteAddress,
    // todo checked before used
    method: request.method as HttpMethod,
    url: parse(request.url ?? '', true),
    headers: newHttpHeaders(request.headers),

    query(): Record<string, string | string[] | undefined> {
      return this.url.query;
    },

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
