import {ControllerMiddleware, HttpMethod, None} from '#wexen';

export type ControllerRoute = {
  path?: string | None;
  version?: string | None;
  tags?: string[] | None;
  guards?: ControllerMiddleware[];
  [HttpMethod.Delete]?: ControllerMiddleware;
  [HttpMethod.Get]?: ControllerMiddleware;
  [HttpMethod.Head]?: ControllerMiddleware;
  [HttpMethod.Options]?: ControllerMiddleware;
  [HttpMethod.Patch]?: ControllerMiddleware;
  [HttpMethod.Post]?: ControllerMiddleware;
  [HttpMethod.Put]?: ControllerMiddleware;
};
