import {Middleware, None} from '#wexen';

export type WebServerConfig = {
  httpPort: number;
  httpsPort: number;
  middlewares?: Middleware[] | None;
};
