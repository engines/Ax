ax.extensions.cycle = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let period = options.period || 500;
  let collection = options.collection || '⣯⣟⡿⢿⣻⣽⣾⣷';

  let max = collection.length - 1;

  let cycleTag = {
    $count: 0,
    $nodes: (el) => collection[el.$count],
    $init: (el) => {
      setInterval(() => {
        if (el.$count === max) {
          el.$count = 0;
        } else {
          el.$count++;
        }
        el.$render();
      }, period);
    },
    ...options.cycleTag,
  };

  return a['ax-appkit-cycle'](cycleTag);
};
