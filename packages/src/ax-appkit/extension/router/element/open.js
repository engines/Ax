ax.extension.router.element.open = (options) => (el) => (
  path,
  query,
  anchor
) => {
  if (path[0] != '/') {
    path = options.scope + (path ? `/${path}` : '');
  }

  el.$locate(path, query, anchor);

  el.$send('ax.appkit.router.open', {
    detail: {
      path: path,
      query: query,
      anchor: anchor,
    },
  });
};
