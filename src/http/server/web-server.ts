import {
  HttpError,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
  logger,
  logRequest,
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
  return async (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => {
    const performanceTime = process.hrtime.bigint();
    const request = newHttpRequest(stream, headers);

    try {
      const response = await middlewareResponse(config, request);
      addCors(config, request, response);
      await response.send(stream, request);

      logRequest(request, response, performanceTime);
    } catch (error: any) {
      const response = errorResponse(error);
      addCors(config, request, response);
      await response.send(stream, request);

      logRequest(request, response, performanceTime, `\n${String(error['stack'] ?? error)}`);
    }
  };
}

async function middlewareResponse(config: WebServerConfig, request: HttpRequest): Promise<HttpResponse> {
  if (!config.middlewares?.length) {
    throw new HttpError(HttpStatusCode.InternalServerError, 'Middlewares Not Found');
  }

  for (const middleware of config.middlewares) {
    const response = await middleware(request);

    if (response) {
      return response;
    }
  }

  return newNotFoundResponse();
}

function errorResponse(error: unknown): HttpResponse {
  const message = error instanceof HttpError ? error.message : 'Internal Error';
  const statusCode = error instanceof HttpError ? error.statusCode : HttpStatusCode.InternalServerError;

  return newJsonResponse({error: message}, statusCode);
}

function addCors(config: WebServerConfig, request: HttpRequest, response: HttpResponse) {
  const origin = request.headers['origin'];

  if (origin && config.origins?.includes(origin)) {
    response.headers['access-control-allow-origin'] = origin;
  }
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
