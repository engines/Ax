// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax, dependencies={}) => factory(ax, dependencies)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax, dependencies={}) {

ax.extensions.chartjs = function (options = {}) {
  var a = ax.a;
  var x = ax.x;

  return a['ax-appkit-chartjs'](
    a.div(
      [
        a.canvas({
          $init: (el) => {
            el.$chart = new x.chartjs.Chart(el.getContext('2d'), {
              ...options,
              ...options.chartjs,
            });
          },
          ...options.canvasTag,
        }),
      ],
      options.divTag || {}
    ),
    options.chartjsTag || {}
  );
};

ax.extensions.chartjs.Chart = dependencies.Chart || window.Chart;

}));
