ax.extension.router.router.open = (config) =>
  function (locator = null, query = {}, anchor = null) {
    if (locator) {
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

      config.router[0].$open(path, query, anchor);
    } else {
      config.router[0].$go();
    }
  };
