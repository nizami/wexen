import {LogLevel, TerminalColor} from '#wexen';

export function logLevelToTerminalColor(level: LogLevel): TerminalColor {
  switch (level) {
    case LogLevel.Error:
      return TerminalColor.FG_RED;

    case LogLevel.Warn:
      return TerminalColor.FG_YELLOW;

    case LogLevel.Info:
      return TerminalColor.FG_BLUE;

    case LogLevel.Verbose:
      return TerminalColor.FG_GRAY;

    case LogLevel.Debug:
      return TerminalColor.FG_WHITE;

    case LogLevel.Silly:
      return TerminalColor.FG_MAGENTA;

    default:
      return TerminalColor.FG_WHITE;
  }
}
