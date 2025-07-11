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
  const remoteAddress = request.remoteAddress ?? '<unknown>';
  const ip = remoteAddress.replace('::ffff:', '').padEnd(16, ' ');

  logger[level](`${ip} ${statusCodeText} ${methodText} ${request.url.href}${messageText}`, color);
}
