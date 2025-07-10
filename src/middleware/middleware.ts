import {HttpRequest, HttpResponse, None} from '#wexen';

export type Middleware = (request: HttpRequest) => HttpResponse | None;
