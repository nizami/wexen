import {HttpRequest, HttpResponse, None} from '#wexen';

export type ControllerMiddleware = (
  data: any,
  request: HttpRequest,
) => None | HttpResponse | Promise<HttpResponse>;
