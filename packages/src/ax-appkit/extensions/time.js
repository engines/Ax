ax.extensions.time = function (options = {}) {
  return a.time({
    $init: (el) => options.ticking ? setInterval(el.$render, 1000) : null,
    $text: () => new Date().toLocaleTimeString(),
    ...options.timeTag,
  });
};
