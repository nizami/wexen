import {HttpRequest, HttpResponse, None} from '#wexen';

export type ServerMiddleware = (request: HttpRequest) => Promise<HttpResponse | None>;
