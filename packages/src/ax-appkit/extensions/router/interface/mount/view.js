ax.extensions.router.interface.routes.view = (config, mountElement) => {
  let scope = config.scope || '';
  let scopedpath = config.path.slice(scope.length);
  let match = config.match || {};
  let splats = config.splats || [];
  let lazy = config.lazy;
  let defaultContent = config.default;
  let transition = config.transition;
  let component;
  let slash;
  let matched;

  let routesKeys = Object.keys(config.routes);

  for (let i in routesKeys) {
    let routesKey = routesKeys[i];

    for (let key of routesKey.split(',')) {
      matched = ax.x.router.interface.routes.view.match(key.trim(), scopedpath);
      if (matched) {
        matched.key = routesKey;
        break;
      }
    }

    if (matched) {
      component = config.routes[routesKey];
      splats = [...matched.splats, ...splats];
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
      ? (route) => {
          let message = `'${scopedpath}' not found`;
          console.warn(message, route);
          return a['.error'](message);
        }
      : config.default;
  }

  if (ax.is.function(component)) {
    let route = ax.x.router.interface({
      path: config.path,
      query: config.query,
      anchor: config.anchor,
      router: config.router,
      mounts: [...config.mounts, mountElement],
      scope: scope,
      match: match,
      splats: splats,
      slash: slash,
      lazy: lazy,
      default: defaultContent,
      transition: transition,
    });
    component = component(route);
  }

  return {
    matched: matched,
    component: a['ax-appkit-router-view']([component]),
    scope: scope,
  };
};
