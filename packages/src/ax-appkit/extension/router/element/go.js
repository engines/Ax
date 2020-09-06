ax.extension.router.element.go = (el) => () => {
  let location = el.$location();
  el.$load(location.path, location.query, location.anchor);
};
