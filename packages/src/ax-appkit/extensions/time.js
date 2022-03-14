ax.extensions.time = function (options = {}) {
  return a.time({
    $init: (el) => setInterval(el.$render, 1000),
    $text: () => new Date().toLocaleTimeString(),
    ...options.timeTag,
  });
};
