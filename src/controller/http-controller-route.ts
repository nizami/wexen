import {HttpControllerMethod, HttpMethod, None} from '#wexen';

export type HttpControllerRoute = {
  path?: string | None;
  version?: string | None;
  tags?: string[] | None;
  [HttpMethod.Delete]?: HttpControllerMethod;
  [HttpMethod.Get]?: HttpControllerMethod;
  [HttpMethod.Head]?: HttpControllerMethod;
  [HttpMethod.Options]?: HttpControllerMethod;
  [HttpMethod.Patch]?: HttpControllerMethod;
  [HttpMethod.Post]?: HttpControllerMethod;
  [HttpMethod.Put]?: HttpControllerMethod;
};
