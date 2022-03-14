ax.extensions.router.element.reload = (el) => () => {
  let location = el.$location()
  el.$load(location.path, location.query, location.anchor)
};
