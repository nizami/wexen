import {HttpRequest, HttpResponse} from '#wexen';

export type HttpControllerMethod = (data: any, request: HttpRequest) => HttpResponse | Promise<HttpResponse>;
