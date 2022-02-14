ax.extensions.report.field.controls.output = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-output').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.output(options), r.validation(options)],
    controlTagOptions
  );
};
