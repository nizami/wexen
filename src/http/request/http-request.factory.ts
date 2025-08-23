import {contentTypeByFilePath, FileRequestInfo, HttpMethod, HttpRequest, None} from '#wexen';
import {WriteStream} from 'node:fs';
import {IncomingHttpHeaders, ServerHttp2Stream} from 'node:http2';
import Stream from 'node:stream';

export function newHttpRequest(stream: ServerHttp2Stream, headers: IncomingHttpHeaders): HttpRequest {
  let _url: URL | None = null;
  let _data: Buffer | None = null;
  let _text: string | None = null;
  let _json: unknown | None = null;

  return {
    session: stream.session,
    method: headers[':method'] as HttpMethod ?? HttpMethod.Unknown,
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

    async file(cb: (fileName: string) => WriteStream): Promise<FileRequestInfo> {
      const fileName = headers['x-filename']?.toString() ?? crypto.randomUUID();
      const outputStream = cb(fileName);
      stream.pipe(outputStream);

      await streamFinish(outputStream);

      return {
        name: fileName,
        type: contentTypeByFilePath(fileName),
        size: outputStream.bytesWritten,
      };
    },
  };
}

function urlFromHeaders(headers: IncomingHttpHeaders): URL {
  const scheme = headers[':scheme'] || 'https';
  const authority = headers[':authority'] || headers['host'] || 'localhost';
  const path = headers[':path'] || '/';
  const urlString = `${scheme}://${authority}${path}`;

  return new URL(urlString);
}

function streamToData(stream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

function streamFinish(stream: Stream): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.on('error', (error) => reject(error));
    stream.on('finish', () => resolve());
  });
}
