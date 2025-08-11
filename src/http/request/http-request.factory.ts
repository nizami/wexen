import {HttpMethod, HttpRequest, None} from '#wexen';
import {IncomingHttpHeaders, ServerHttp2Stream} from 'node:http2';

const DEFAULT_MAX_REQUEST_DATA_SIZE_BYTES = 10 * 1024 * 1024;

export function newHttpRequest(stream: ServerHttp2Stream, headers: IncomingHttpHeaders): HttpRequest {
  let _url: URL | None = null;
  let _data: Buffer | None = null;
  let _text: string | None = null;
  let _json: unknown | None = null;

  return {
    session: stream.session,
    method: headers[':method'] as HttpMethod | None,
    headers,

    get url(): URL {
      _url ??= urlFromHeaders(headers);

      return _url;
    },

    async data(): Promise<Buffer> {
      _data ??= await streamToData(stream);

      return _data;
    },

    async json(): Promise<unknown> {
      _json ??= JSON.parse(await this.text());

      return _json;
    },

    async text(): Promise<string> {
      _text ??= (await streamToData(stream)).toString();

      return _text;
    },

    // async files(maxFileSizeBytes = DEFAULT_MAX_REQUEST_DATA_SIZE_BYTES): Promise<string> {
    //   const contentType = this.headers['content-type'];

    //   if (!contentType) {
    //     return '';
    //   }

    //   const boundaryMatch = contentType.match(/boundary=(.+)$/);

    //   if (!boundaryMatch) {
    //     return '';
    //   }

    //   const boundary = `--${boundaryMatch[1]}`;

    //   let buffer = Buffer.alloc(0);
    //   let currentFile: WriteStream | null = null;

    //   stream.on('data', (chunk: Buffer) => {
    //     buffer = Buffer.concat([buffer, chunk]);

    //     let boundaryIndex: number;
    //     while ((boundaryIndex = buffer.indexOf(boundary)) >= 0) {
    //       const part = buffer.subarray(0, boundaryIndex);
    //       buffer = buffer.subarray(boundaryIndex + boundary.length);

    //       if (currentFile) {
    //         // Remove trailing CRLF before boundary
    //         const trimmed = part.subarray(0, part.length - 2);
    //         if (trimmed.length > 0) currentFile.write(trimmed);
    //         currentFile.end();
    //         currentFile = null;
    //       } else {
    //         const headerEnd = part.indexOf('\r\n\r\n');
    //         if (headerEnd > -1) {
    //           const headersPart = part.subarray(0, headerEnd).toString();
    //           const fileMatch = headersPart.match(/filename="(.+?)"/);

    //           if (fileMatch) {
    //             const filename = fileMatch[1];
    //             const filePath = path.join(UPLOAD_DIR, filename);
    //             currentFile = fs.createWriteStream(filePath);
    //             const fileData = part.subarray(headerEnd + 4);
    //             if (fileData.length > 0) currentFile.write(fileData);
    //           }
    //         }
    //       }

    //       // Remove leading CRLF after boundary
    //       if (buffer.subarray(0, 2).toString() === '\r\n') {
    //         buffer = buffer.subarray(2);
    //       }
    //     }
    //   });

    //   request.on('end', () => {
    //     res.writeHead(200, {'content-type': 'text/plain'});
    //     res.end('Upload complete');
    //   });
    // },
  };
}

function urlFromHeaders(headers: IncomingHttpHeaders): URL {
  const scheme = headers[':scheme'] || 'https';
  const authority = headers[':authority'] || headers['host'] || 'localhost';
  const path = headers[':path'] || '/';
  const urlString = `${scheme}://${authority}${path}`;

  return new URL(urlString);
}

function streamToData(stream: ServerHttp2Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);

    stream.on('data', (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
    });
    stream.on('end', () => {
      resolve(buffer);
    });

    stream.on('error', (err) => reject(err));
  });
}
