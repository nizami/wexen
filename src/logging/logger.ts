import {LogLevel, logLevelToTerminalColor, None, terminalColor, TerminalColor} from '#wexen';
import util from 'node:util';

export const logger = {
  error: (message: string, color?: TerminalColor | None) => {
    console.log(logFormat(LogLevel.Error, message, color).join(' '));
  },

  warn: (message: string, color?: TerminalColor | None) => {
    console.log(logFormat(LogLevel.Warn, message, color).join(' '));
  },

  info: (message: string, color?: TerminalColor | None) => {
    console.log(logFormat(LogLevel.Info, message, color).join(' '));
  },

  verbose: (message: string, color?: TerminalColor | None) => {
    console.log(logFormat(LogLevel.Verbose, message, color).join(' '));
  },

  debug: (message: string, color?: TerminalColor | None) => {
    console.log(logFormat(LogLevel.Debug, message, color).join(' '));
  },

  silly: (message: string, color?: TerminalColor | None) => {
    console.log(logFormat(LogLevel.Silly, message, color).join(' '));
  },
};

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:\n' + util.format(error));
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:\n' + util.format(reason));
});

// let performanceTime = performance.now();

function logFormat(level: LogLevel, message: string, color?: TerminalColor | None): string[] {
  const dateTime = new Date();
  // const date = dateTime.toISOString().slice(0, 10);
  const time =
    dateTime.toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) +
    '.' +
    String(dateTime.getMilliseconds()).padStart(3, '0');
  // const levelCode = level[0];
  const levelColor = color ?? logLevelToTerminalColor(level);
  // const inTime = formatPerformanceTime(performance.now() - performanceTime);
  // performanceTime = performance.now();

  // if (forConsole) {
  return [
    `[${terminalColor(`${time}`, TerminalColor.FG_GRAY)}]`,
    // `[${terminalColor(levelCode, TerminalColor.FG_GRAY)}]`,
    terminalColor(message, levelColor),
  ];
  // }

  // return [`[${date} ${time}]`, `[${levelCode}]`, message];
}

// function formatPerformanceTime(ms: number): string {
//   let totalSeconds = Math.floor(ms / 1000);
//   let totalMinutes = Math.floor(totalSeconds / 60);

//   let milliseconds = Math.floor(ms % 1000);
//   let seconds = totalSeconds % 60;
//   let minutes = totalMinutes % 60;
//   let hours = Math.floor(totalMinutes / 60);

//   let hh = String(hours).padStart(2, '0');
//   let mm = String(minutes).padStart(2, '0');
//   let ss = String(seconds).padStart(2, '0');
//   let mss = String(milliseconds).padStart(3, '0');

//   return `${hh}:${mm}:${ss}.${mss}`;
// }
