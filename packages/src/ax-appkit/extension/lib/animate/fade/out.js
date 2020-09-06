ax.extension.lib.animate.fade.out = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.transition = `opacity 0ms`;
  el.style.opacity = 1;
  setTimeout(() => {
    el.style.transition = `opacity ${duration}ms linear`;
    setTimeout(() => {
      el.style.opacity = 0;
      let complete = () => {
        el.style.display = 'none';
        if (options.complete) options.complete(el);
      };
      setTimeout(complete, duration);
    }, 10);
  }, 10);
};
