import {HttpControllerRoute, HttpRequest, HttpResponse, newJsonHttpResponse, None} from '#mini-web';

export function resolveControllerRoute(
  routes: HttpControllerRoute[],
  request: HttpRequest,
): HttpControllerRoute | None {
  const pathname = request.url.pathname?.toLowerCase();

  if (!pathname) {
    return null;
  }

  return routes.find((x) => x.path === pathname);
}

export function resolveRouteResponse(route: HttpControllerRoute, request: HttpRequest): HttpResponse | None {
  if (!request.method) {
    return null;
  }

  // const {query} = request.url;

  const method = route[request.method];

  if (!method) {
    return newJsonHttpResponse({message: 'Not Found'}, 404);
  }

  // const parameters = getFunctionParameters(method);
  // const values = parameters.map((x) => query[x]);

  // // todo validate params also
  // if (parameters.length !== values.length) {
  //   return newJsonHttpResponse({message: 'Bad Request'}, 400);
  // }

  return method.apply(route, [request]);
}
