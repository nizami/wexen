import {
  HttpController,
  HttpMethod,
  HttpRequest,
  HttpResponse,
  joinUrl,
  logger,
  Middleware,
  None,
} from '#wexen';

export function controllerMiddleware(controllers: HttpController[]): Middleware {
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

        route.assert?.apply(route, [data, request]);

        return method.apply(route, [data, request]);
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
