const contentTypes: Record<string, string> = {
  css: 'text/css',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  html: 'text/html',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  jsonc: 'application/json',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  wav: 'audio/wav',
  webp: 'image/webp',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml: 'application/xml',
  zip: 'application/zip',
};

export function contentTypeByFileExtension(extension: string): string {
  return contentTypes[extension] ?? 'application/octet-stream';
}

export function contentTypeByFilePath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase();

  if (extension) {
    return contentTypeByFileExtension(extension);
  }

  return 'application/octet-stream';
}
