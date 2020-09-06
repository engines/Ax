ax.extension.router.interface.load = (config) =>
  function (locator = null, query = {}, anchor = null) {
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
    }

    config.router.$load(path, query, anchor);
  };
