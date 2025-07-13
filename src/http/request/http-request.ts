import {HttpHeaders, HttpMethod, None} from '#wexen';
import {UrlWithParsedQuery} from 'url';

export type HttpRequest = {
  method: HttpMethod;
  remoteAddress?: string | None;
  headers: HttpHeaders;
  // todo replace 'UrlWithParsedQuery'
  url: UrlWithParsedQuery;
  // queryParams: Record<string, string>;
  // pathParams: Record<string, string>;
  // payload: Record<string, string>;

  query(): Record<string, string | string[] | undefined>;
  text(): Promise<string>;
  json(): Promise<unknown>;
};
