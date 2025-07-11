import {HttpEndpoint, HttpMethod, HttpRequest, HttpResponse, newJsonHttpResponse, None} from '#wexen';

export function resolveControllerRoute(routes: HttpEndpoint[], request: HttpRequest): HttpEndpoint | None {
  const pathname = request.url.pathname?.toLowerCase();

  if (!pathname) {
    return null;
  }

  return routes.find((x) => x.path === pathname);
}

export async function resolveEndpointResponse(
  endpoint: HttpEndpoint,
  request: HttpRequest,
): Promise<HttpResponse | None> {
  if (!request.method) {
    return null;
  }

  // const {query} = request.url;

  const method = endpoint[request.method];

  if (!method) {
    return newJsonHttpResponse({message: 'Not Found'}, 404);
  }

  // const parameters = getFunctionParameters(method);
  // const values = parameters.map((x) => query[x]);

  // // todo validate params also
  // if (parameters.length !== values.length) {
  //   return newJsonHttpResponse({message: 'Bad Request'}, 400);
  // }

  const data = await getData(request);

  return method.apply(endpoint, [data, request]);
}

async function getData(request: HttpRequest): Promise<unknown> {
  if (request.method === HttpMethod.Get || request.method === HttpMethod.Head) {
    return request.url.query;
  }

  return request.json();
}
