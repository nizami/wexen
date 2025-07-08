import {HttpRequest, HttpResponse, newFileHttpResponse, newJsonHttpResponse, None} from '#mini-web';
import {existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';

export function staticFilesMiddleware(
  staticFilesPath: string,
): (request: HttpRequest) => HttpResponse | None {
  return (request: HttpRequest): HttpResponse | None => {
    const requestPath = request.url?.path?.slice(1) || 'index.html';
    const path = resolve(staticFilesPath, requestPath);

    if (path && existsSync(path) && statSync(path).isFile()) {
      return newFileHttpResponse(path);
    }

    return newJsonHttpResponse({message: `Not Found '${path}'`}, 404);
  };
}
