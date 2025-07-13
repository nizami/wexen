import {
  controllerMiddleware,
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
import {existsSync, readFileSync} from 'node:fs';
import http, {IncomingMessage, ServerResponse} from 'node:http';
import https from 'node:https';
import {networkInterfaces} from 'node:os';
import {resolve} from 'node:path';

export function runWebServer(config: WebServerConfig): {httpServer: http.Server; httpsServer: https.Server} {
  const httpsOptions: https.ServerOptions = {
    // ...getCertificate(),
  };

  const middlewares: Middleware[] = [];

  if (config.controllers) {
    middlewares.push(controllerMiddleware(config.controllers));
  }

  if (config.staticFilesMiddleware) {
    middlewares.push(config.staticFilesMiddleware);
  }

  logger.info(`Web server is running:`, TerminalColor.FG_GREEN);
  logger.info(`-`.repeat(24), TerminalColor.FG_GREEN);

  const httpServer = http
    .createServer(serverListener(middlewares))
    .listen(config.httpPort, () => logListening('http', config.httpPort));

  const httpsServer = https
    .createServer(httpsOptions, serverListener(middlewares))
    .listen(config.httpsPort, () => logListening('https', config.httpsPort));

  return {
    httpServer,
    httpsServer,
  };
}

function serverListener(middlewares: Middleware[]) {
  return async (req: IncomingMessage, res: ServerResponse) => {
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

function logListening(protocol: string, port: number): void {
  logger.info(`${protocol}://localhost:${port}`, TerminalColor.FG_GREEN);

  const interfaces = networkInterfaces();

  Object.keys(interfaces)
    .map((x) => interfaces[x] ?? [])
    .flat()
    .filter((x) => x.family === 'IPv4' && !x.internal)
    .forEach((x) => logger.info(`${protocol}://${x.address}:${port}`, TerminalColor.FG_GREEN));

  logger.info(`-`.repeat(24), TerminalColor.FG_GREEN);
}

function getCertificate(): {cert: Buffer; key: Buffer} | undefined {
  // ../cert/cert.pem
  const certFilePath = resolve(import.meta.dirname, 'cert.pem');
  const keyFilePath = resolve(import.meta.dirname, 'key.pem');

  if (existsSync(certFilePath) && existsSync(keyFilePath)) {
    return {
      cert: readFileSync(certFilePath),
      key: readFileSync(keyFilePath),
    };
  }

  logger.error(`Certificate not found`);
}

function isSuccessfulStatusCode(statusCode: HttpStatusCode): boolean {
  return statusCode >= 200 && statusCode < 300;
}
