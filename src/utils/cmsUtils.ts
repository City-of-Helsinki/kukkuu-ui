export const stripLocaleFromUri = (uri: string): string => {
  return uri.replace(/^\/(en|sv|fi)(?![a-z0-9])/i, '');
};

/**
 * Remove a single slash from given path's beginning and from its end.
 * @param path
 * @returns Input path with single slash, if present, removed from its beginning
 * and similarly from its end.
 * */
export const removeSurroundingSlashes = (path: string) => {
  return path.replace(/(^\/|\/$)/g, '');
};

export const normalizeCmsUri = (uri: string) => {
  return decodeURIComponent(removeSurroundingSlashes(stripLocaleFromUri(uri)));
};
