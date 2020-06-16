ax.extension.lib.animate.fade.out = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.transition = `opacity ${duration}ms linear`;

  let complete = () => {
    el.style.display = 'none';
    if (options.complete) options.complete(el);
  };

  setTimeout(() => (el.style.opacity = 0), 0);
  setTimeout(complete, duration);
};
