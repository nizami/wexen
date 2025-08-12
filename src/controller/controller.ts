import {Middleware, None} from '#wexen';

export type Controller = {
  path: string;
  middlewares?: Middleware[] | None;
  children?: Controller[] | None;
};
