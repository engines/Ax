ax.extensions.lib.animate.slide.in = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.transition = `max-height 0ms`;
  el.style.maxHeight = '0px';
  setTimeout(() => {
    el.style.display = options.display || 'block';
    el.style.transition = `max-height ${duration}ms ease-in`;
    setTimeout(() => {
      el.style.maxHeight = '1000px';
      let complete = () => {
        el.style.maxHeight = '';
        if (options.complete) options.complete(el);
      };
      setTimeout(complete, duration);
    }, 10);
  }, 10);
};
