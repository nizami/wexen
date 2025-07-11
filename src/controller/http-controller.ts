import {HttpControllerRoute} from '#wexen';

export type HttpController = {
  path: string;
  routes: HttpControllerRoute[];
};
