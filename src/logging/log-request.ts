import {HttpRequest, HttpResponse, logger, LogLevel, None, TerminalColor} from '#wexen';

export function logRequest(
  level: LogLevel,
  request: HttpRequest,
  response: HttpResponse,
  message?: string | None,
  color?: TerminalColor | None,
): void {
  const statusCodeText = String(response.statusCode).padStart(3, '0');
  const methodText = request.method.padEnd(6, ' ');
  const messageText = message ? ' ' + message : '';
  const ip = `${request.remoteAddress.replace('::ffff:', '')}`.padEnd(16, ' ');

  logger[level](`${ip} ${statusCodeText} ${methodText} ${request.originalUrl}${messageText}`, color);
}
