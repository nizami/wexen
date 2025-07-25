import {
  HttpMethod,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
  Middleware,
  newFileResponse,
  newJsonResponse,
  None,
} from '#wexen';
import {existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';

export function staticFilesMiddleware(staticFileDirectories: string[]): Middleware {
  return async (request: HttpRequest): Promise<HttpResponse | None> => {
    if (request.method !== HttpMethod.Get) {
      const notAllowedResponse = newJsonResponse(
        {error: 'Method Not Allowed'},
        HttpStatusCode.MethodNotAllowed,
      );

      notAllowedResponse.headers.set('Allow', 'GET');

      return notAllowedResponse;
    }

    const requestPath = request.url?.path?.slice(1) || 'index.html';

    for (const directory of staticFileDirectories) {
      const path = resolve(directory, requestPath);

      if (path && existsSync(path) && statSync(path).isFile()) {
        return newFileResponse(path);
      }
    }
  };
}
