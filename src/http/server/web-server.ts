import {
  HttpError,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
  humanizeTime,
  logger,
  LogLevel,
  logRequest,
  Middleware,
  newHttpRequest,
  newNotFoundResponse,
  TerminalColor,
  WebServerConfig,
} from '#wexen';
import {createSecureServer, Http2Server, Http2ServerRequest, Http2ServerResponse} from 'node:http2';
import {networkInterfaces} from 'node:os';

export function runWebServer(config: WebServerConfig): Http2Server {
  logger.info(`Web server is running:`, TerminalColor.FG_GREEN);
  logger.info(`-`.repeat(24), TerminalColor.FG_GREEN);

  return createSecureServer(config, serverListener(config)).listen(config.port, () => logListening(config));
}

function serverListener(config: WebServerConfig) {
  const middlewares = config.middlewares ?? [];

  return async (req: Http2ServerRequest, res: Http2ServerResponse) => {
    const performanceTime = process.hrtime.bigint();

    try {
      if (!req.url) {
        throw new Error('URL Not Found');
      }

      if (!req.method) {
        throw new Error('HTTP Method Not Found');
      }

      const request = newHttpRequest(req);
      const response = await middlewareResponse(middlewares, request);

      await response.send(req, res);

      const humanizedTime = humanizeTime(process.hrtime.bigint() - performanceTime);
      const logLevel = isSuccessfulStatusCode(response.statusCode) ? LogLevel.Info : LogLevel.Error;

      logRequest(logLevel, req, response.statusCode, humanizedTime);
    } catch (err: any) {
      const error =
        err instanceof HttpError ? err : new HttpError(HttpStatusCode.InternalServerError, 'Internal Error');

      res.writeHead(error.statusCode, {'Content-Type': 'application/json'});
      // todo don't use stringify
      res.end(JSON.stringify({error: error.message}));

      const humanizedTime = humanizeTime(process.hrtime.bigint() - performanceTime);
      logRequest(LogLevel.Error, req, error.statusCode, `${humanizedTime}\n${String(err['stack'] ?? err)}`);
    }
  };
}

async function middlewareResponse(middlewares: Middleware[], request: HttpRequest): Promise<HttpResponse> {
  for (const middleware of middlewares) {
    const response = await middleware(request);

    if (response) {
      return response;
    }
  }

  return newNotFoundResponse();
}

function logListening(config: WebServerConfig): void {
  logger.info(`https://localhost:${config.port}`);

  const interfaces = networkInterfaces();

  Object.keys(interfaces)
    .map((x) => interfaces[x] ?? [])
    .flat()
    .filter((x) => x.family === 'IPv4' && !x.internal)
    .forEach((x) => logger.info(`https://${x.address}:${config.port}`));

  logger.info(`-`.repeat(24));
}

function isSuccessfulStatusCode(statusCode: HttpStatusCode): boolean {
  return statusCode >= 200 && statusCode < 300;
}
