import {HttpController, Middleware, None} from '#wexen';

export type WebServerConfig = {
  httpPort: number;
  httpsPort: number;
  controllers?: HttpController[] | None;
  staticFilesMiddleware?: Middleware | None;
};
