ax.extensions.lib.animate.fade.in = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.transition = `opacity 0ms`;
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.display = options.display || 'block';
    el.style.transition = `opacity ${duration}ms linear`;
    setTimeout(() => {
      el.style.opacity = 1;
      let complete = () => {
        if (options.complete) options.complete(el);
      };
      setTimeout(complete, duration);
    }, 10);
  }, 10);
};
