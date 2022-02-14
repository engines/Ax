ax.extensions.router.element.init = (el) => {
  window.addEventListener('popstate', el.$pop);
};
