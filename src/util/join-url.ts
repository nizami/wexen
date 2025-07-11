import {None} from '#wexen';

export function joinUrl(...parts: (string | None)[]): string {
  return parts
    .flatMap((x) => x?.split('/'))
    .filter((x) => !!x)
    .join('/');
}
