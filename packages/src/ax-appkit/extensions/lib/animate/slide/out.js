ax.extensions.lib.animate.slide.out = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.transition = `max-height 0ms`;
  el.style.maxHeight = '1000px';
  el.style.overflow = 'hidden';
  setTimeout(() => {
    el.style.transition = `max-height ${duration}ms ease-out`;
    setTimeout(() => {
      el.style.maxHeight = '0px';
      let complete = () => {
        el.style.display = 'none';
        if (options.complete) options.complete(el);
      };
      setTimeout(complete, duration);
    }, 10);
  }, 10);
};
