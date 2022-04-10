ax.extensions.lib.animate.slide.toggle = function (el, options = {}) {
  if (el.style.display === 'none') {
    this.in(el, options);
  } else {
    this.out(el, options);
  }
};
