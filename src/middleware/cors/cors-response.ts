import {HttpMethod, HttpResponse, HttpStatusCode, newHttpHeaders} from '#wexen';
import {Http2ServerRequest, Http2ServerResponse} from 'node:http2';

export function newCorsResponse(origins: string[]): HttpResponse {
  return {
    statusCode: HttpStatusCode.NotFound,
    headers: newHttpHeaders({'content-type': 'application/json'}),

    async send(req: Http2ServerRequest, res: Http2ServerResponse): Promise<void> {
      const origin = req.headers.origin;

      if (origin && origins?.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === HttpMethod.Options) {
        res.writeHead(HttpStatusCode.NoContent);
        res.end();
      }
    },
  };
}
