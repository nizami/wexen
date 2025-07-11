import {HttpRoute} from '#wexen';

export type HttpController = {
  path: string;
  routes: HttpRoute[];
};
