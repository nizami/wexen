import {HttpEndpoint} from '#wexen';

export type HttpController = {
  path: string;
  endpoints: HttpEndpoint[];
};
