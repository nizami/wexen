import {HttpResponse, HttpStatusCode} from '#wexen';
import {gzip} from 'zlib';

export function newHtmlResponse(html: string | Buffer, statusCode = HttpStatusCode.Ok): HttpResponse {
  return {
    headers: {
      ':status': statusCode,
      'content-type': 'text/html',
    },

    async send(stream, request) {
      const acceptEncoding = request.headers['accept-encoding'];
      const supportsGzip = acceptEncoding?.includes('gzip');

      if (supportsGzip) {
        gzip(html, (err, compressedData) => {
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
        stream.respond(this.headers);
        stream.end(html);
      }
    },
  };
}
