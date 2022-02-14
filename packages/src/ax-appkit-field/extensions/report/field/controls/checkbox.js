ax.extensions.report.field.controls.checkbox = function (r, options) {
  let a = ax.a;

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-checkbox').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.checkbox(options), r.validation(options)],
    controlTagOptions
  );
};
