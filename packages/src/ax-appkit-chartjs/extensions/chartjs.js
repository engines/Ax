ax.extensions.chartjs = function (options = {}) {
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
