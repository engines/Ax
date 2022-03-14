ax.extensions.router.element.load = (el) => (path, query, anchor) => {
  let mounted = x.lib.unnested(el, 'ax-appkit-router-routes');
  mounted.forEach((r) => {
    r.$load(path, query, anchor);
  });
};
