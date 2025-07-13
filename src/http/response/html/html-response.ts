import {HttpResponse, newHttpHeaders} from '#wexen';
import {IncomingMessage, ServerResponse} from 'node:http';
import {gzip} from 'zlib';

export type HtmlResponse = HttpResponse & {};

export function newHtmlResponse(html: string | Buffer, statusCode: number = 200): HtmlResponse {
  return {
    statusCode,
    headers: newHttpHeaders({'content-type': 'text/html'}),
    body: html,

    async send(request: IncomingMessage, response: ServerResponse): Promise<void> {
      const acceptEncoding = request.headers['accept-encoding'];
      const supportsGzip = acceptEncoding?.includes('gzip');

      if (supportsGzip) {
        gzip(this.body, (err, compressedData) => {
          if (err) {
            response.writeHead(500);
            response.end('Compression Error');

            return;
          }

          response.setHeader('Content-Encoding', 'gzip');
          response.setHeader('Content-Type', 'text/html');
          response.writeHead(response.statusCode, this.headers.items);
          response.end(compressedData);
        });
      } else {
        response.writeHead(response.statusCode, this.headers.items);
        response.end(this.body);
      }
    },
  };
}
