import {
  controllerMiddleware,
  HttpController,
  HttpRequest,
  HttpResponse,
  logger,
  LogLevel,
  logRequest,
  Middleware,
  newHttpRequest,
  newJsonHttpResponse,
  None,
  staticFilesMiddleware,
  TerminalColor,
} from '#wexen';
import {existsSync, readFileSync} from 'node:fs';
import http, {IncomingMessage, ServerResponse} from 'node:http';
import https from 'node:https';
import {networkInterfaces} from 'node:os';
import {resolve} from 'node:path';

export type WebServerConfig = {
  httpPort: number;
  httpsPort: number;
  controllers: HttpController[];
  staticFilesPath: string;
};

export function runWebServer(config: WebServerConfig): {httpServer: http.Server; httpsServer: https.Server} {
  const httpsOptions: https.ServerOptions = {
    ...getCertificate(),
  };

  const routes = config.controllers.flatMap((controller) =>
    controller.routes.map((route) => ({
      ...route,
      path: '/' + joinUrl(controller.path, route.path).toLowerCase(),
    })),
  );

  const middlewares = [controllerMiddleware(routes), staticFilesMiddleware(config.staticFilesPath)];

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
    try {
      if (!req.url) {
        throw new Error('URL Not Found');
      }

      if (!req.method) {
        throw new Error('HTTP Method Not Found');
      }

      const request = newHttpRequest(req);
      const response = middlewareResponse(middlewares, request);

      await response.send(req, res);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        logRequest(LogLevel.Info, request, response, null, TerminalColor.FG_GREEN);
      } else {
        logRequest(LogLevel.Error, request, response);
      }
    } catch (error: any) {
      res.writeHead(400, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({message: 'Internal Error'}));

      logger.error(
        `${500} ${req.method} ${req.url} ip: ${req.socket.remoteAddress} ${String(error['stack'] ?? error)}`,
      );
    }
  };
}

function middlewareResponse(middlewares: Middleware[], request: HttpRequest): HttpResponse {
  for (const middleware of middlewares) {
    const response = middleware(request);

    if (response) {
      return response;
    }
  }

  return newJsonHttpResponse({message: 'Not Found'}, 404);
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

function joinUrl(...parts: (string | None)[]): string {
  return parts
    .flatMap((x) => x?.split('/'))
    .filter((x) => !!x)
    .join('/');
}
