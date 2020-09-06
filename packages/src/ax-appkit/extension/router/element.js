ax.extension.router.element = (options) => {
  let routerTag = {
    id: options.id,
    $init: ax.extension.router.element.init,
    $nodes: ax.extension.router.element.nodes(options),
    $go: ax.extension.router.element.go,
    $open: ax.extension.router.element.open(options),
    $locate: ax.extension.router.element.locate,
    $location: ax.extension.router.element.location,
    $load: ax.extension.router.element.load,
    ...options.routerTag,
  };

  return a['ax-appkit-router'](null, routerTag);
};
