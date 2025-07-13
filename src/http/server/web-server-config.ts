import {Controller, None, ServerMiddleware} from '#wexen';

export type WebServerConfig = {
  httpPort: number;
  httpsPort: number;
  controllers?: Controller[] | None;
  staticFilesMiddleware?: ServerMiddleware | None;
};
