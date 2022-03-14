ax.extensions.router.element = (options) => {
  let routerTag = {
    id: options.id,
    $init: ax.extensions.router.element.init(options),
    $pop: ax.extensions.router.element.pop,
    $open: ax.extensions.router.element.open(options),
    $locate: ax.extensions.router.element.locate,
    $location: ax.extensions.router.element.location,
    $load: ax.extensions.router.element.load,
    $reload: ax.extensions.router.element.reload,
    ...options.routerTag,
  };

  return a['ax-appkit-router'](routerTag);
};
