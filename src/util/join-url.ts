export function joinUrl(...parts: string[]): string {
  return parts
    .flatMap((x) => x.split('/'))
    .join('/');
}
