ax.extensions.router.element.locate = (el) => (path, query, anchor) => {
  path = path || '/';

  query = x.lib.query.stringify(query);
  path =
    (path || '/') + (query ? '?' + query : '') + (anchor ? '#' + anchor : '');

  history.pushState(
    {
      urlPath: path,
    },
    '',
    path
  );
  let event = new PopStateEvent('popstate', {
    urlPath: path,
  });
  dispatchEvent(event);
};
