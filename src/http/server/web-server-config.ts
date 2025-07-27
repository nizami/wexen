import {Middleware} from '#wexen';
import {SecureServerOptions} from 'node:http2';

export type WebServerConfig = SecureServerOptions & {
  port: number;
  middlewares?: Middleware[];
};
