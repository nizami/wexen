import {$WebType, HttpHeaders, HttpMethod} from '#wexen';
import {Brand, Model} from 'rtt';
import {UrlWithParsedQuery} from 'url';

export type HttpRequest = Model &
  Brand<'Web.HttpRequest'> & {
    remoteAddress: string;
    method: HttpMethod;
    originalUrl: string;
    // todo replace 'UrlWithParsedQuery'
    url: UrlWithParsedQuery;
    headers: HttpHeaders;
  };

export const $HttpRequest = () => $WebType<HttpRequest>('HttpRequest');
