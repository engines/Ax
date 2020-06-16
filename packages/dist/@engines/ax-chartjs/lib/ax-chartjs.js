// Axf Framework, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax) => factory(ax)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax) {

ax.extension.chartjs = function (options = {}) {
  var a = ax.a;
  var x = ax.x;

  var wrapperTag = {
    $init: function () {
      this.$chart = new x.chartjs.Chart(
        this.$('canvas').getContext('2d'),
        options.chartjs || {}
      );
    },
    ...options.wrapperTag,
  };

  return a['div|ax-chartjs-chart-wrapper'](
    [a.canvas(null, options.canvasTag)],
    wrapperTag
  );
};

// .chart alias
ax.extension.chart = ax.extension.chartjs;

ax.extension.chartjs.Chart = window.Chart;

}));
