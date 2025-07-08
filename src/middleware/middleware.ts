import {HttpRequest, HttpResponse, None} from '#mini-web';

export type Middleware = (request: HttpRequest) => HttpResponse | None;
