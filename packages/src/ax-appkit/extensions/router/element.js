ax.extensions.router.element = (options) => {
  let routerTag = {
    id: options.id,
    $init: ax.extensions.router.element.init,
    $nodes: ax.extensions.router.element.nodes(options),
    $pop: ax.extensions.router.element.pop,
    $open: ax.extensions.router.element.open(options),
    $locate: ax.extensions.router.element.locate,
    $location: ax.extensions.router.element.location,
    $load: ax.extensions.router.element.load,
    ...options.routerTag,
  };

  return a['ax-appkit-router'](routerTag);
};
