import {
  HttpControllerRoute,
  HttpRequest,
  HttpResponse,
  None,
  resolveControllerRoute,
  resolveRouteResponse,
} from '#wexen';

export function controllerMiddleware(
  routes: HttpControllerRoute[],
): (request: HttpRequest) => HttpResponse | None {
  return (request: HttpRequest): HttpResponse | None => {
    const route = resolveControllerRoute(routes, request);

    if (!route) {
      return null;
    }

    return resolveRouteResponse(route, request);
  };
}
