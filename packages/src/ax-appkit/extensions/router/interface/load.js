ax.extensions.router.interface.load = (config) =>
  function (locator = '', query = {}, anchor) {
    let path = window.location.pathname;

    if (locator) {
      if (locator[0] == '/') {
        path = locator;
      } else {
        if (path.match(/\/$/)) {
          path = `${path}${locator}`;
        } else {
          path = `${path}/${locator}`;
        }
      }
      path = new URL(path, window.location.origin).pathname;
    }

    config.router.$load(path, query, anchor);
  };
