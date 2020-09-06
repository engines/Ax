ax.extension.chartjs = function (options = {}) {
  var a = ax.a;
  var x = ax.x;

  return a['ax-appkit-chartjs'](
    a.div(
      [
        a.canvas(null, {
          $init: (el) => {
            el.$chart = new x.chartjs.Chart(el.getContext('2d'), {
              ...options,
              ...options.chartjs,
            });
          },
          ...options.canvasTag,
        }),
      ],
      options.divTag
    ),
    options.chartjsTag
  );
};
