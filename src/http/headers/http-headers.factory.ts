import {$HttpHeaders, HttpHeaderList, HttpHeaders, None} from '#wexen';

export function newHttpHeaders(items: HttpHeaderList & Record<string, string | string[]>): HttpHeaders {
  return {
    $type: $HttpHeaders(),
    items,

    get(key: string): string | string[] | None {
      const value = this.items[key];

      if (typeof value === 'string') {
        return value;
      }

      return undefined;
    },

    set(key: string, value: string | string[] | None): void {
      if (value == null) {
        delete this.items[key];
      } else {
        this.items[key] = value;
      }
    },
  };
}
