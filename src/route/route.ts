import {HttpMethod, Middleware} from '#wexen';

export type RoutePath = `/${string}` & {};

export type Route = {
  path: RoutePath;
  method: HttpMethod;
  middleware: Middleware;
};

export function newRoute(path: RoutePath, method: HttpMethod, middleware: Middleware): Route {
  return {
    path,
    method,
    middleware,
  };
}
