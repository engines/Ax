ax.extensions.router.element.open = (options) => (el) => (
  path,
  query,
  anchor
) => {
  if (path[0] != '/') {
    path = options.scope + (path ? `/${path}` : '');
  }

  el.$locate(path, query, anchor);
};
