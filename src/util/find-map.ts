import {None} from '#wexen';

export function findMap<T, V>(items: T[], predicateMap: (item: T) => V | None): V | None {
  for (const item of items) {
    const result = predicateMap(item);

    if (result != null) {
      return result;
    }
  }

  return null;
}
