import {$WebType, HttpHeaders, HttpStatusCode} from '#mini-web';
import {IncomingMessage, ServerResponse} from 'node:http';
import {Brand, Model} from 'rtt';

export type HttpResponse = Model &
  Brand<'Web.HttpResponse'> & {
    statusCode: HttpStatusCode;
    headers: HttpHeaders;
    body: string | Buffer;

    send(request: IncomingMessage, response: ServerResponse): Promise<void>;
  };

export const $HttpResponse = () => $WebType<HttpResponse>('HttpResponse');
