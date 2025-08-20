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
  newJsonResponse,
  newNotFoundResponse,
  TerminalColor,
  WebServerConfig,
} from '#wexen';
import {createSecureServer, Http2Server, IncomingHttpHeaders, ServerHttp2Stream} from 'node:http2';
import {networkInterfaces} from 'node:os';

const DIVIDER = `-`.repeat('https://000.000.000.000:65536'.length);

export function runWebServer(config: WebServerConfig): Http2Server {
  logger.info(`Web server is running:`, TerminalColor.FG_GREEN);
  logger.info(DIVIDER);

  const server = createSecureServer(config);

  return server.on('stream', onServerStream(config)).listen(config.port, () => logListening(config));
}

function onServerStream(config: WebServerConfig) {
  const middlewares = [...(config.middlewares ?? [])];

  return async (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => {
    const performanceTime = process.hrtime.bigint();
    const request = newHttpRequest(stream, headers);

    try {
      const response = await middlewareResponse(middlewares, request);

      const origin = request.headers['origin'];

      if (origin && config.origins?.includes(origin)) {
        response.headers['access-control-allow-origin'] = origin;
      }

      await response.send(stream, request);

      const humanizedTime = humanizeTime(process.hrtime.bigint() - performanceTime);

      const statusCode = response.headers[':status'];
      const logLevel = isSuccessfulStatusCode(statusCode) ? LogLevel.Info : LogLevel.Error;
      logRequest(logLevel, request, statusCode, humanizedTime);
    } catch (error: any) {
      const message = error instanceof HttpError ? error.message : 'Internal Error';
      const statusCode = error instanceof HttpError ? error.statusCode : HttpStatusCode.InternalServerError;

      const response = newJsonResponse({error: message}, statusCode);
      await response.send(stream, request);

      const humanizedTime = humanizeTime(process.hrtime.bigint() - performanceTime);
      logRequest(LogLevel.Error, request, statusCode, `${humanizedTime}\n${String(error['stack'] ?? error)}`);
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

  logger.info(DIVIDER);
}

function isSuccessfulStatusCode(statusCode: HttpStatusCode): boolean {
  return statusCode >= 200 && statusCode < 300;
}
