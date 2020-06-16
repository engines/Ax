ax.extension.cycle = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let period = options.period || 500;
  let collection = options.collection || '⣯⣟⡿⢿⣻⣽⣾⣷';

  let max = collection.length - 1;

  let cycleTag = {
    $state: 0,
    $nodes: (el, i) => collection[i],
    $init: function () {
      let target = this;
      let cycle = function () {
        setTimeout(function () {
          if (target.$state === max) {
            target.$state = 0;
          } else {
            target.$state++;
          }
          cycle();
        }, period);
      };
      cycle();
    },
    ...options.cycleTag,
  };

  return a['|appkit-cycle'](null, cycleTag);
};
