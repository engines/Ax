ax.extension.router.router = (config) => (location) => {
  config = {
    ...config,
  };

  config.scope = config.scope || '';
  config.match = config.match || {};
  config.splat = config.splat || [];
  config.slash = config.slash || '';

  let router = {};

  router.path = location.path;
  router.query = location.query;
  router.anchor = location.anchor;
  router.scope = config.scope;
  router.match = config.match;
  router.splat = config.splat;
  router.slash = config.slash;
  router.params = {
    ...config.match,
    ...location.query,
  };
  router.loaded = () => config.router[0].$loaded;
  router.load = ax.x.router.router.load(config);
  router.open = ax.x.router.router.open(config);
  router.nest = ax.x.router.router.nest(config, location);

  return router;
};
