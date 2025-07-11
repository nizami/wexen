import {$WebType, HttpHeaders, HttpMethod, None} from '#wexen';
import {Brand, Model} from 'rtt';
import {UrlWithParsedQuery} from 'url';

export type HttpRequest = Model &
  Brand<'Web.HttpRequest'> & {
    method: HttpMethod;
    remoteAddress?: string | None;
    headers: HttpHeaders;
    // todo replace 'UrlWithParsedQuery'
    url: UrlWithParsedQuery;
    // queryParams: Record<string, string>;
    // pathParams: Record<string, string>;
    // payload: Record<string, string>;

    data(): Promise<string>;
    json(): Promise<unknown>;
  };

export const $HttpRequest = () => $WebType<HttpRequest>('HttpRequest');
