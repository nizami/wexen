import {Middleware, None} from '#wexen';

export type Controller = {
  path?: string | None;
  middlewares?: Middleware[] | None;
  children?: Controller[] | None;
};
