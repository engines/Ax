ax.extensions.router = (options = {}) => {
  if (options.home) {
    if (window.location.pathname.match(/^$|^\/$/)) {
      window.history.replaceState({}, 'Home', options.home);
    }
  }

  return ax.x.router.element(options);
};
