import {
  HttpEndpoint,
  HttpRequest,
  HttpResponse,
  Middleware,
  None,
  resolveControllerRoute,
  resolveEndpointResponse,
} from '#wexen';

export function controllerMiddleware(routes: HttpEndpoint[]): Middleware {
  return async (request: HttpRequest): Promise<HttpResponse | None> => {
    const route = resolveControllerRoute(routes, request);

    if (!route) {
      return null;
    }

    return resolveEndpointResponse(route, request);
  };
}
