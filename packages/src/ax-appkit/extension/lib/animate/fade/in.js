ax.extension.lib.animate.fade.in = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.display = options.display || 'block';
  el.style.transition = `opacity ${duration}ms linear`;

  let complete = () => {
    if (options.complete) options.complete(el);
  };

  setTimeout(() => (el.style.opacity = 1), 0);
  setTimeout(complete, duration);
};
