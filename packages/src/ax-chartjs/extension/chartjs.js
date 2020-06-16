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
