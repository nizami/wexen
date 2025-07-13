import {HttpRequest, HttpResponse, None} from '#wexen';

export type Middleware = (request: HttpRequest) => Promise<HttpResponse | None>;
