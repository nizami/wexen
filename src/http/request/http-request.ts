import {HttpMethod, None} from '#wexen';
import {Http2Session, IncomingHttpHeaders} from 'node:http2';

export type HttpRequest = {
  session?: Http2Session | None;
  method?: HttpMethod | None;
  headers: IncomingHttpHeaders;
  url: URL;

  data(): Promise<Buffer>;
  text(): Promise<string>;
  json(): Promise<unknown>;
};
