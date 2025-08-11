import {contentTypeFromExtension, HttpResponse, HttpStatusCode} from '#wexen';
import {readFileSync} from 'node:fs';
import {gzip} from 'zlib';

export type FileResponse = HttpResponse & {
  readonly filePath: string;
};

//  use BufferResponse for fileResponse and htmlResponse
export function newFileResponse(filePath: string, statusCode = HttpStatusCode.Ok): FileResponse {
  return {
    filePath,
    headers: {
      ':status': statusCode,
      'content-type': 'text/html',
    },

    async send(stream, request) {
      const acceptEncoding = request.headers['accept-encoding'];
      const supportsGzip = acceptEncoding?.includes('gzip');
      const fileContent = readFileSync(filePath);

      if (supportsGzip) {
        gzip(fileContent, (err, compressedData) => {
          if (err) {
            this.headers[':status'] = HttpStatusCode.InternalServerError;
            this.headers['content-type'] = 'text/plain';
            stream.respond(this.headers);
            stream.end('Compression Error');

            return;
          }

          this.headers['content-encoding'] = 'gzip';
          stream.respond(this.headers);
          stream.end(compressedData);
        });
      } else {
        const pathExtension = this.filePath.split('.').pop()?.toLowerCase() || '';
        const contentType = contentTypeFromExtension(pathExtension);
        this.headers['content-type'] = contentType;
        stream.respond(this.headers);
        stream.end(fileContent);
      }
    },
  };
}
