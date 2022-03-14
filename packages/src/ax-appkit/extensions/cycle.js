ax.extensions.cycle = function (options = {}) {
  let period = options.period || 500;
  let collection = options.collection || '⣯⣟⡿⢿⣻⣽⣾⣷';

  let max = collection.length - 1;

  let cycleTag = {
    $count: 0,
    $nodes: (el) => collection[el.$count],
    $init: (el) => {
      el.$interval = setInterval(() => {
        if (el.$count === max) {
          el.$count = 0;
        } else {
          el.$count++;
        }
        el.$render();
      }, period);
    },
    $exit: (el) => {
      clearInterval(el.$interval);
    },
    ...options.cycleTag,
  };

  return a['ax-appkit-cycle'](cycleTag);
};
