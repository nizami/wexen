import {
  HttpRequest,
  HttpResponse,
  HttpRoute,
  Middleware,
  None,
  resolveRoute,
  resolveRouteResponse,
} from '#wexen';

export function controllerMiddleware(routes: HttpRoute[]): Middleware {
  return async (request: HttpRequest): Promise<HttpResponse | None> => {
    const route = resolveRoute(routes, request);

    if (!route) {
      return null;
    }

    return resolveRouteResponse(route, request);
  };
}
