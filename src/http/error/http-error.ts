import {$WebType, HttpStatusCode} from '#mini-web';
import {Brand, Model} from 'rtt';

export type HttpError = Model &
  Brand<'Web.HttpError'> & {
    statusCode: HttpStatusCode;
    message: string;
  };

export const $HttpError = () => $WebType<HttpError>('HttpError');
