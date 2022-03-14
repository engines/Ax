ax.extensions.router.element.nodes = (options) => (el) => {
  let location = el.$location();

  let config = {
    path: location.path,
    query: location.query,
    anchor: location.anchor,
    scope: '',
    default: options.default,
    home: options.home,
    lazy: options.lazy,
    transition: options.transition,
    router: el,
    mounts: [],
  };

  let routes = options.routes || {};

  let route = x.router.interface(config);

  if (options.scope) {
    let scopeRoutes = {}
    scopeRoutes[options.scope] = (route) => {
      if (ax.is.function(routes)) {
        return routes(route);
      } else {
        return route.mount({ routes: routes });
      }
    }
    scopeRoutes['*'] = ''
    return route.mount({ routes: scopeRoutes })
  } else {
    if (ax.is.function(routes)) {
      return routes(route);
    } else {
      return route.mount({ routes: routes });
    }
  }

};
