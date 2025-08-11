import {Controller, HttpRequest, HttpResponse, joinUrl, Middleware, None} from '#wexen';

export function controllerMiddleware(controllers: Controller[]): Middleware {
  const controllerDictionary = prepareControllers(controllers);

  return async (request: HttpRequest): Promise<HttpResponse | None> => {
    const requestPath = request.url.pathname?.toLowerCase() ?? '';
    const middlewares: Middleware[] | None = controllerDictionary[requestPath];

    if (!middlewares) {
      return null;
    }

    for (const middleware of middlewares) {
      const result = await middleware(request);

      if (result != null) {
        return result;
      }
    }

    return null;
  };
}

export function prepareControllers(
  controllers: Controller[] | None,
  parentPath: string = '',
  result: Record<string, Middleware[]> = {},
): Record<string, Middleware[]> {
  if (!controllers?.length) {
    return result;
  }

  for (const controller of controllers) {
    const path = '/' + joinUrl(parentPath, controller.path).toLowerCase();

    if (controller.middlewares?.length) {
      result[path] ??= [];
      result[path].push(...controller.middlewares);
    }

    if (controller.children) {
      prepareControllers(controller.children, path, result);
    }
  }

  return result;
}
