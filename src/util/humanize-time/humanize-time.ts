export function humanizeTime(ns: bigint): string {
  const totalMilliseconds = ns / 1_000_000n;
  const totalSeconds = totalMilliseconds / 1000n;
  const totalMinutes = totalSeconds / 60n;

  const nanoseconds = ns % 1_000_000n;
  const milliseconds = totalMilliseconds % 1000n;
  const seconds = totalSeconds % 60n;
  const minutes = totalMinutes % 60n;
  const hours = totalMinutes / 60n;

  const result = [];

  if (hours > 0) {
    result.push(`${hours}h`);
  }

  if (minutes > 0) {
    result.push(`${minutes}m`);
  }

  if (seconds > 0) {
    result.push(`${seconds}s`);
  }

  if (milliseconds > 0) {
    result.push(`${milliseconds}ms`);
  } else if (nanoseconds > 0) {
    result.push(`0.${ns / 1_000n}ms`);
  }

  return result.join('');
}
