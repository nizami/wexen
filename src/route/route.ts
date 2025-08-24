import {Controller, HttpMethod, HttpRequest, HttpResponse} from '#wexen';

export const ROUTES_MAP: Map<string, Map<HttpMethod, Route>> = new Map();

export function Route(path: RoutePath, method: HttpMethod): RouteDecoratorFunction {
  return (originalFunction) => {
    path = path.toLowerCase() as RoutePath;
    const routeMap = ROUTES_MAP.get(path) ?? new Map<HttpMethod, Route>();

    if (routeMap.has(method)) {
      return;
    }
    // initializer
    const route: Route = {
      path,
      method,
      originalFunction,
    };

    routeMap.set(method, route);
    ROUTES_MAP.set(path, routeMap);
  };
}

export function Post(path: RoutePath): RouteDecoratorFunction {
  return Route(path, HttpMethod.Post);
}

export function Authorize(): AuthorizeDecoratorFunction {
  return (originalFunction) => {
    return function (this: Controller, request: HttpRequest) {
      console.log('Authorize');

      return originalFunction.call(this, {...request, user: 1});
    };
  };
}

export type AuthorizeRequest = HttpRequest & {
  user: number;
};

export type RoutePath = `/${string}` & {};
export type RouteFunction<T = HttpRequest> =
  | ((request: T) => Promise<HttpResponse>)
  | (() => Promise<HttpResponse>);
export type RouteDecoratorFunction = (target: RouteFunction, context: ClassMethodDecoratorContext) => void;
export type AuthorizeFunction =
  | ((request: AuthorizeRequest) => Promise<HttpResponse>)
  | (() => Promise<HttpResponse>);
export type AuthorizeDecoratorFunction = (
  target: AuthorizeFunction,
  context: ClassMethodDecoratorContext,
) => void;

export type Route = {
  path: RoutePath;
  method: HttpMethod;
  originalFunction: RouteFunction;
};
