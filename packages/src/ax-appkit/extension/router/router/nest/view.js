ax.extension.router.router.nest.view = (config) => (
  routesElement,
  location
) => {
  let scope = config.scope || '';
  let scopedpath = location.path.slice(scope.length);
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

    matched = ax.x.router.router.nest.matcher(routesKey, scopedpath);

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
      ? (controller) => {
          let message = `'${scopedpath}' not found`;
          let el = config.router[config.router.length - 1];
          console.warn(message, controller, config.router);
          return (a, x) => a['.error'](message);
        }
      : config.default;
  }

  if (ax.is.function(component)) {
    let controller = ax.x.router.router({
      router: [...config.router, routesElement],
      scope: scope,
      match: match,
      splat: splat,
      slash: slash,
      lazy: lazy,
      default: defaultContent,
      transition: transition,
    })(location);
    component = ax.a['|appkit-router-view']([component(controller)], {
      $init: function () {
        if (location.anchor) {
          let anchored = window.document.getElementById(location.anchor);
          if (!anchored)
            console.warn(`Appkit router view cannot find #${location.anchor}`);
          if (anchored) anchored.scrollIntoView();
        }
      },
    });
  }

  return {
    matched: !!matched,
    component: component,
    scope: scope,
  };
};
