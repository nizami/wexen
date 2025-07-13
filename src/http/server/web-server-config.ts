import {Controller, Middleware, None} from '#wexen';

export type WebServerConfig = {
  httpPort: number;
  httpsPort: number;
  controllers?: Controller[] | None;
  staticFilesMiddleware?: Middleware | None;
};
