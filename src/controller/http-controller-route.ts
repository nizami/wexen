import { HttpMethod, HttpRequest, HttpResponse, None } from '#wexen';

export type HttpControllerRoute = {
  path?: string | None;
  [HttpMethod.Delete]?: (request: HttpRequest) => HttpResponse;
  [HttpMethod.Get]?: (request: HttpRequest) => HttpResponse;
  [HttpMethod.Head]?: (request: HttpRequest) => HttpResponse;
  [HttpMethod.Patch]?: (request: HttpRequest) => HttpResponse;
  [HttpMethod.Post]?: (request: HttpRequest) => HttpResponse;
  [HttpMethod.Put]?: (request: HttpRequest) => HttpResponse;
};
