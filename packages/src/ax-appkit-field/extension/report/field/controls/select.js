ax.extension.report.field.controls.select = function (r, options) {
  let a = ax.a;

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-select').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.select(options), r.validation(options)],
    controlTagOptions
  );
};
