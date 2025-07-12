import {HttpControllerMethod, HttpMethod, HttpRequest, None} from '#wexen';

export type HttpControllerRoute = {
  path?: string | None;
  version?: string | None;
  tags?: string[] | None;
  assert?: ((data: any, request: HttpRequest) => void) | None;
  [HttpMethod.Delete]?: HttpControllerMethod;
  [HttpMethod.Get]?: HttpControllerMethod;
  [HttpMethod.Head]?: HttpControllerMethod;
  [HttpMethod.Options]?: HttpControllerMethod;
  [HttpMethod.Patch]?: HttpControllerMethod;
  [HttpMethod.Post]?: HttpControllerMethod;
  [HttpMethod.Put]?: HttpControllerMethod;
};
