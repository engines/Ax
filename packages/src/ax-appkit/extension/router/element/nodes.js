ax.extension.router.element.nodes = (options) => (el) => {
  let start = el.$location();

  let config = {
    path: start.path,
    query: start.query,
    anchor: start.anchor,
    scope: options.scope, // || '',
    default: options.default,
    home: options.home,
    lazy: options.lazy,
    transition: options.transition,
    router: el,
    mounts: [],
  };

  let routes = options.routes || {};

  let router = x.router.interface(config);

  if (ax.is.function(routes)) {
    return routes(router);
  } else {
    return router.mount({ routes: routes });
  }
};
