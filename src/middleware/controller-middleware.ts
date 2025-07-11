import {
  HttpController,
  HttpRequest,
  HttpResponse,
  invokeControllerMethod,
  joinUrl,
  logger,
  Middleware,
  newNotFoundResponse,
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

  return async (request: HttpRequest): Promise<HttpResponse | None> => {
    // todo optimize to quickly find route by path
    return invokeControllerMethod(routes, request) ?? newNotFoundResponse();
  };
}
