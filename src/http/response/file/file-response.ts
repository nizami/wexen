import {contentTypeFromExtension, HttpResponse, newHttpHeaders} from '#wexen';
import {readFileSync} from 'node:fs';
import {IncomingMessage, ServerResponse} from 'node:http';
import {gzip} from 'zlib';

export type FileResponse = HttpResponse & {
  readonly filePath: string;
};

export function newFileResponse(filePath: string, statusCode: number = 200): FileResponse {
  const pathExtension = filePath.split('.').pop()?.toLowerCase() || '';

  return {
    statusCode,
    headers: newHttpHeaders({'content-type': contentTypeFromExtension(pathExtension)}),
    body: readFileSync(filePath),
    filePath,

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
