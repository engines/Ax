ax.extension.router.element.pop = (el) => () => {
  let location = el.$location();
  el.$load(location.path, location.query, location.anchor);
  el.$send('ax.appkit.router.pop');
};
