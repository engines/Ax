ax.extension.router.element.init = (el) => {
  const pop = () => el.$go();
  window.addEventListener('popstate', pop);
  el.$send('ax.appkit.router.load', {
    detail: el.$location(),
  });
};
