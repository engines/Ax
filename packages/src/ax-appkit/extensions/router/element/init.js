ax.extensions.router.element.init = (options) => (el) => {
  window.addEventListener('popstate', el.$pop);
  el.$nodes = ax.extensions.router.element.nodes(options);
};
