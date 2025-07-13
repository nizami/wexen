export function humanizeTime(ms: bigint): string {
  let totalSeconds = Math.floor(ms / 1000);
  let totalMinutes = Math.floor(totalSeconds / 60);

  let milliseconds = Math.floor(ms % 1000);
  let seconds = totalSeconds % 60;
  let minutes = totalMinutes % 60;
  let hours = Math.floor(totalMinutes / 60);

  let hh = String(hours).padStart(2, '0');
  let mm = String(minutes).padStart(2, '0');
  let ss = String(seconds).padStart(2, '0');
  let mss = String(milliseconds).padStart(3, '0');

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
  }

  return result.join(' ');
}
