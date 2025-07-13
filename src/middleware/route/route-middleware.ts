import {HttpMethod, Middleware} from '#wexen';

export function routeMiddleware(method: HttpMethod, middleware: Middleware): Middleware {
  return async (request) => {
    if (request.method !== method) {
      return null;
    }

    return middleware(request);
  };
}
