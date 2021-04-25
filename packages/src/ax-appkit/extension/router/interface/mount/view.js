ax.extension.router.interface.mount.view = (config, mountElement) => {
  let scope = config.scope || '';
  let scopedpath = config.path.slice(scope.length);
  let match = config.match || {};
  let splat = config.splat || [];
  let lazy = config.lazy;
  let defaultContent = config.default;
  let transition = config.transition;
  let component;
  let slash;
  let matched;

  let routesKeys = Object.keys(config.routes);

  for (let i in routesKeys) {
    let routesKey = routesKeys[i];

    matched = ax.x.router.interface.mount.view.match(routesKey, scopedpath);

    if (matched) {
      component = config.routes[routesKey];
      splat = [...matched.splat, ...splat];
      match = {
        ...match,
        ...matched.params,
      };
      slash = matched.slash;
      scope = `${scope}${matched.scope}`.replace(/\/$/, '');

      break;
    }
  }

  if (!matched) {
    component = ax.is.undefined(config.default)
      ? (router) => {
          let message = `'${scopedpath}' not found`;
          let el = config.mounts[config.mounts.length - 1];
          console.warn(message, router);
          return (a, x) => a['.error'](message);
        }
      : config.default;
  }

  if (ax.is.function(component)) {
    let router = ax.x.router.interface({
      path: config.path,
      query: config.query,
      anchor: config.anchor,
      router: config.router,
      mounts: [...config.mounts, mountElement],
      scope: scope,
      match: match,
      splat: splat,
      slash: slash,
      lazy: lazy,
      default: defaultContent,
      transition: transition,
    });
    component = ax.a['ax-appkit-router-view'](component(router), {
      $init: (el) => {
        if (config.anchor) {
          let anchored = window.document.getElementById(config.anchor);
          if (!anchored)
            console.warn(
              `Router cannot find #${config.anchor} to scroll into view.`
            );
          if (anchored) anchored.scrollIntoView();
        }
      },
    });
  } else {
    component = ax.a['ax-appkit-router-view'](component);
  }

  return {
    matched: !!matched,
    component: component,
    scope: scope,
  };
};
