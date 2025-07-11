import {HttpControllerRoute, HttpMethod, HttpRequest, HttpResponse, None} from '#wexen';

export async function invokeControllerMethod(
  routes: HttpControllerRoute[],
  request: HttpRequest,
): Promise<HttpResponse | None> {
  const requestPath = request.url.pathname?.toLowerCase() ?? '';

  for (const route of routes) {
    const method = route[request.method];

    if (method && route.path === requestPath) {
      const data = await getRequestData(request);

      return method.apply(route, [data, request]);
    }
  }

  return null;
}

async function getRequestData(request: HttpRequest): Promise<unknown> {
  if (request.method === HttpMethod.Get || request.method === HttpMethod.Head) {
    return request.url.query;
  }

  return request.json();
}
