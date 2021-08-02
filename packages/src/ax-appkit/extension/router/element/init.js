ax.extension.router.element.init = (el) => {
  window.addEventListener('popstate', el.$pop);
};
