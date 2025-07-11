import {HttpMethod, HttpRequest, HttpResponse, None} from '#wexen';

export type HttpRoute = {
  path?: string | None;
  version?: string | None;
  tags?: string[] | None;
  [HttpMethod.Delete]?: (data: any, request: HttpRequest) => HttpResponse | Promise<HttpResponse>;
  [HttpMethod.Get]?: (data: any, request: HttpRequest) => HttpResponse | Promise<HttpResponse>;
  [HttpMethod.Head]?: (data: any, request: HttpRequest) => HttpResponse | Promise<HttpResponse>;
  [HttpMethod.Options]?: (data: any, request: HttpRequest) => HttpResponse | Promise<HttpResponse>;
  [HttpMethod.Patch]?: (data: any, request: HttpRequest) => HttpResponse | Promise<HttpResponse>;
  [HttpMethod.Post]?: (data: any, request: HttpRequest) => HttpResponse | Promise<HttpResponse>;
  [HttpMethod.Put]?: (data: any, request: HttpRequest) => HttpResponse | Promise<HttpResponse>;
};
