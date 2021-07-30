ax.extension.router.element.init = (el) => {
  window.addEventListener('popstate', el.$go);
  el.$send('ax.appkit.router.load', {
    detail: el.$location(),
  });
};
