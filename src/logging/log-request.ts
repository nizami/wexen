import {HttpStatusCode, logger, LogLevel, None, TerminalColor} from '#wexen';
import {Http2ServerRequest} from 'node:http2';

export function logRequest(
  level: LogLevel,
  request: Http2ServerRequest,
  statusCode: HttpStatusCode,
  message?: string | None,
  color?: TerminalColor | None,
): void {
  const statusCodeText = String(statusCode).padStart(3, '0');
  const methodText = (request.method ?? '<none>').padEnd(6, ' ');
  const url = request.url ?? '<none>';
  const messageText = message ? ' ' + message : '';
  const remoteAddress = request.socket.remoteAddress ?? '<none>';
  const ip = remoteAddress.replace('::ffff:', '').padEnd(16, ' ');

  logger[level](`${ip} ${statusCodeText} ${methodText} ${url}${messageText}`, color);
}
