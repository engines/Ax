ax.extensions.router.interface = (config) => {
  let result = {};
  result.path = config.path;
  result.query = config.query;
  result.anchor = config.anchor;
  result.scope = config.scope;
  result.match = config.match;
  result.splats = config.splats;
  result.slash = config.slash;
  result.params = {
    ...config.match,
    ...config.query,
  };

  result.load = ax.x.router.interface.load(config);
  result.open = ax.x.router.interface.open(config);

  result.mount = ax.x.router.interface.routes(config);

  return result;
};
