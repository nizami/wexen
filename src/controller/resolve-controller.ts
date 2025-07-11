import {HttpMethod, HttpRequest, HttpResponse, HttpRoute, newNotFoundResponse, None} from '#wexen';

export function resolveRoute(routes: HttpRoute[], request: HttpRequest): HttpRoute | None {
  const pathname = request.url.pathname?.toLowerCase();

  if (!pathname) {
    return null;
  }

  return routes.find((x) => x.path === pathname);
}

export async function resolveRouteResponse(
  route: HttpRoute,
  request: HttpRequest,
): Promise<HttpResponse | None> {
  if (!request.method) {
    return null;
  }

  const method = route[request.method];

  if (!method) {
    return newNotFoundResponse();
  }

  const data = await getRequestData(request);

  return method.apply(route, [data, request]);
}

async function getRequestData(request: HttpRequest): Promise<unknown> {
  if (request.method === HttpMethod.Get || request.method === HttpMethod.Head) {
    return request.url.query;
  }

  return request.json();
}
