import {
  Controller,
  findMap,
  HttpMethod,
  HttpRequest,
  HttpResponse,
  joinUrl,
  logger,
  None,
  ServerMiddleware,
} from '#wexen';

export function controllerMiddleware(controllers: Controller[]): ServerMiddleware {
  if (controllers.length === 0) {
    logger.warn('No controllers in middleware');

    return async () => null;
  }

  const routes = controllers.flatMap((controller) =>
    controller.routes.map((route) => ({
      ...route,
      path: '/' + joinUrl(controller.path, route.path).toLowerCase(),
    })),
  );

  // todo optimize to quickly find route by path
  return async (request: HttpRequest): Promise<HttpResponse | None> => {
    const requestPath = request.url.pathname?.toLowerCase() ?? '';

    for (const route of routes) {
      const method = route[request.method];

      if (method && route.path === requestPath) {
        const data = await getRequestData(request);

        if (route.guards) {
          return findMap(route.guards, (guard) => guard(data, request)) ?? method(data, request);
        }

        return method(data, request);
      }
    }

    return null;
  };
}

async function getRequestData(request: HttpRequest): Promise<unknown> {
  if (request.method === HttpMethod.Get || request.method === HttpMethod.Head) {
    return request.url.query;
  }

  return request.json();
}
