import {Controller, HttpRequest, HttpResponse, Middleware, None, ROUTES_MAP} from '#wexen';

export function controllerMiddleware(controllers: Controller[]): Middleware {
  bindRouteFunctions(controllers);

  return async (request: HttpRequest): Promise<HttpResponse | None> => {
    const path = request.url.pathname.toLowerCase();
    const route = ROUTES_MAP.get(path)?.get(request.method);

    return route?.originalFunction?.(request);
  };
}

function bindRouteFunctions(controllers: Controller[]): void {
  const controllerFunctions = getControllerFunctionMap(controllers);

  for (const routes of ROUTES_MAP.values()) {
    for (const route of routes.values()) {
      const controller = controllerFunctions.get(route.originalFunction);

      if (controller) {
        route.originalFunction = route.originalFunction.bind(controller);
      }
    }
  }
}

function getControllerFunctionMap(controllers: any[]): Map<Function, Controller> {
  const controllerFunctions = new Map<Function, Controller>();

  for (const controller of controllers) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
      .map((x) => controller[x])
      .filter((x) => typeof x === 'function')
      .forEach((x) => controllerFunctions.set(x, controller));
  }

  return controllerFunctions;
}
