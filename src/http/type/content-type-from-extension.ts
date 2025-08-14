import {EXTENSION_CONTENT_TYPE} from '#wexen';

export function contentTypeByFileExtension(extension: string): string {
  return (
    EXTENSION_CONTENT_TYPE[extension as keyof typeof EXTENSION_CONTENT_TYPE] ?? 'application/octet-stream'
  );
}

export function contentTypeByFilePath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase();

  if (extension) {
    return contentTypeByFileExtension(extension);
  }

  return 'application/octet-stream';
}
