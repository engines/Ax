ax.extension.router.element.load = (el) => (path, query, anchor) => {
  let mounted = x.lib.unnested(el, 'ax-appkit-router-mount');
  mounted.forEach((r) => {
    r.$load(path, query, anchor);
  });
};
