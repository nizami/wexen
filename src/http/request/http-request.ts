import {HttpMethod, None} from '#wexen';
import {WriteStream} from 'node:fs';
import {Http2Session, IncomingHttpHeaders} from 'node:http2';

export type HttpRequest = {
  session?: Http2Session | None;
  method?: HttpMethod | None;
  headers: IncomingHttpHeaders;
  url: URL;

  data(): Promise<Buffer>;
  text(): Promise<string>;
  json(): Promise<unknown>;
  file(cb: (fileName: string) => WriteStream): Promise<FileRequestInfo>;
};

export type FileRequestInfo = {
  name: string;
  size: number;
  type: string;
};
