ax.extension.cycle = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let period = options.period || 500;
  let collection = options.collection || '⣯⣟⡿⢿⣻⣽⣾⣷';

  let max = collection.length - 1;

  let cycleTag = {
    $state: 0,
    $nodes: (el) => collection[el.$state],
    $init: (el) => {
      setInterval(() => {
        if (el.$state === max) {
          el.$state = 0;
        } else {
          el.$state++;
        }
      }, period);
    },
    ...options.cycleTag,
  };

  return a['ax-appkit-cycle'](null, cycleTag);
};
