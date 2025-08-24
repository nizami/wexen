import {Controller, HttpMethod, HttpRequest, HttpResponse, Middleware, None, Route} from '#wexen';

export type RoutesMap = Record<string, Record<HttpMethod, Route>>;

export function controllerMiddleware(controllers: Controller[]): Middleware {
  const preparedRoutes = prepareControllerRoutes(controllers);

  return async (request: HttpRequest): Promise<HttpResponse | None> => {
    const path = request.url.pathname.toLowerCase();
    const route = preparedRoutes[path]?.[request.method];

    return route?.middleware(request);
  };
}

export function prepareControllerRoutes(controllers: Controller[]): RoutesMap {
  const result: RoutesMap = {};

  for (const route of controllers.flatMap((x) => x.routes)) {
    const path = route.path.toLowerCase();
    result[path] ??= {} as Record<HttpMethod, Route>;
    result[path][route.method] ??= route;
  }

  return result;
}
