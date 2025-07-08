import {HttpControllerRoute} from '#mini-web';

export type HttpController = {
  path: string;
  routes: HttpControllerRoute[];
};
