ax.extensions.router.interface.open = (config) => (
  locator = '',
  query = {},
  anchor
) => {
  let path = window.location.pathname;

  if (locator[0] == '/') {
    path = locator;
  } else if (locator) {
    if (path.match(/\/$/)) {
      path = `${path}${locator}`;
    } else {
      path = `${path}/${locator}`;
    }
  }
  
  config.router.$open(path, query, anchor);
};
