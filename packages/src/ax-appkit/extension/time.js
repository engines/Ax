ax.extension.time = function (options = {}) {
  const a = ax.a;

  let timeTag = {
    $init: (el) => setInterval(el.$render, 1000),
    $text: () => new Date().toLocaleTimeString(),
    ...options.timeTag,
  };

  return a.time(null, timeTag);
};
