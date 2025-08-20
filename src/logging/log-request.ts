import {
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
  humanizeTime,
  logger,
  LogLevel,
  None,
  TerminalColor,
} from '#wexen';

export function logRequest(
  request: HttpRequest,
  response: HttpResponse,
  performanceTime: bigint,
  message?: string | None,
  color?: TerminalColor | None,
): void {
  const statusCode = response.headers[':status'];
  const statusCodeText = String(statusCode).padStart(3, '0');
  const methodText = (request.method ?? '<none>').padEnd(6, ' ');
  const url = request.url ?? '<none>';
  const humanizedTime = humanizeTime(process.hrtime.bigint() - performanceTime);
  const messageText = message ? ' ' + message : '';
  const remoteAddress = request.session?.socket.remoteAddress ?? '<none>';
  const ip = remoteAddress.replace('::ffff:', '').padEnd(16, ' ');
  const level = isSuccessfulStatusCode(statusCode) ? LogLevel.Info : LogLevel.Error;

  logger[level](`${ip} ${statusCodeText} ${methodText} ${url} ${humanizedTime}${messageText}`, color);
}

function isSuccessfulStatusCode(statusCode: HttpStatusCode): boolean {
  return statusCode >= 200 && statusCode < 300;
}
