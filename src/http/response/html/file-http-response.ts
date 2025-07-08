import {$WebType, contentTypeFromExtension, HttpResponse, newHttpHeaders} from '#mini-web';
import {readFileSync} from 'node:fs';
import {IncomingMessage, ServerResponse} from 'node:http';
import {Brand} from 'rtt';
import {gzip} from 'zlib';

export type FileHttpResponse = HttpResponse &
  Brand<'Web.FileHttpResponse'> & {
    readonly filePath: string;
  };

export const $FileHttpResponse = () => $WebType<FileHttpResponse>('FileHttpResponse');

export function newFileHttpResponse(filePath: string, statusCode: number = 200): FileHttpResponse {
  const pathExtension = filePath.split('.').pop()?.toLowerCase() || '';

  return {
    $type: $FileHttpResponse(),
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
