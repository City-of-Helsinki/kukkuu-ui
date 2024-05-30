export const stripLocaleFromUri = (uri: string): string => {
  return uri.replace(/^\/(en|sv|fi)(?![a-z0-9])/i, '');
};

export const removeSurroundingSlashes = (path: string) => {
  return path.replace(/^\/|\/$/g, '');
};

export const normalizeCmsUri = (uri: string) => {
  return removeSurroundingSlashes(stripLocaleFromUri(uri));
};
